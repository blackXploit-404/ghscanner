export const API = "https://api.github.com";

const NOREPLY_SUFFIX = "@users.noreply.github.com";
const BOT_PATTERNS = [/\[bot\]/i, /^noreply@/i, /^no-reply@/i, /^dependabot/i];

export function classifyEmail(email) {
  const lower = email.toLowerCase();
  if (lower.endsWith(NOREPLY_SUFFIX)) return "noreply";
  if (BOT_PATTERNS.some((re) => re.test(lower))) return "bot";
  return "real";
}

export function emailDomain(email) {
  const at = email.lastIndexOf("@");
  return at === -1 ? null : email.slice(at + 1);
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function accountAge(createdAt) {
  const years = (Date.now() - new Date(createdAt).getTime()) / (365.25 * 24 * 3600 * 1000);
  if (years < 1) return `${Math.round(years * 12)} months on GitHub`;
  return `${years.toFixed(1)} years on GitHub`;
}

export const EVENT_LABELS = {
  PushEvent: "pushed to",
  PullRequestEvent: "opened a PR on",
  IssuesEvent: "opened an issue on",
  IssueCommentEvent: "commented on",
  CreateEvent: "created",
  ForkEvent: "forked",
  WatchEvent: "starred",
  ReleaseEvent: "published a release on",
  PullRequestReviewEvent: "reviewed a PR on",
};
export function confidenceFor(hit) {
  if (hit.fromProfile) return "high";
  if (hit.occurrences >= 5 && hit.repos.length >= 2) return "high";
  if (hit.occurrences >= 2) return "medium";
  return "low";
}

export function aggregate(hits, profileEmail) {
  const map = new Map();
  for (const { email, repo } of hits) {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) continue;
    const existing = map.get(trimmed);
    if (existing) {
      existing.occurrences += 1;
      existing.repos.add(repo);
    } else {
      map.set(trimmed, {
        email: trimmed,
        kind: classifyEmail(trimmed),
        occurrences: 1,
        repos: new Set([repo]),
        fromProfile: false,
      });
    }
  }
  if (profileEmail) {
    const existing = map.get(profileEmail);
    if (existing) existing.fromProfile = true;
    else
      map.set(profileEmail, {
        email: profileEmail,
        kind: "real",
        occurrences: 1,
        repos: new Set(),
        fromProfile: true,
      });
  }
  return [...map.values()]
    .map((e) => ({ ...e, repos: [...e.repos] }))
    .sort((a, b) => b.occurrences - a.occurrences);
}

export async function fetchContributions(username) {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
  if (!res.ok) throw new Error("contrib fetch failed");
  return res.json();
}

export function topLanguages(repos) {
  const counts = {};
  for (const r of repos) {
    if (!r.language) continue;
    counts[r.language] = (counts[r.language] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

export function topRepos(repos, n = 3) {
  return [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, n);
}
