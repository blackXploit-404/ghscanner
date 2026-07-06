import { useCallback, useState } from "react";
import useSeo from "../lib/useSeo";
import {
  API,
  aggregate,
  fetchContributions,
  topLanguages,
  topRepos,
} from "../lib/github";
import ProfileCard from "../components/ProfileCard";
import ContributionChart from "../components/ContributionChart";
import EmailResults from "../components/EmailResults";
import ActivityFeed from "../components/ActivityFeed";
import LanguageChart from "../components/LanguageChart";
import TopRepos from "../components/TopRepos";
import TokenInput from "../components/TokenInput";

export default function Home() {
  useSeo({
    title: "GitHub email finder",
    description:
      "Look up a GitHub username's public profile, activity, contribution history, and any emails left in public commit metadata.",
    path: "/",
  });

  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState(null);
  const [rateLimit, setRateLimit] = useState(null);

  const [profile, setProfile] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [emails, setEmails] = useState([]);
  const [events, setEvents] = useState([]);
  const [contributions, setContributions] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [bestRepos, setBestRepos] = useState([]);
  const [reposScanned, setReposScanned] = useState(0);

  const authHeaders = useCallback(
    () => (token.trim() ? { Authorization: `Bearer ${token.trim()}` } : {}),
    [token]
  );

  async function ghFetch(path) {
    const res = await fetch(`${API}${path}`, { headers: authHeaders() });
    const remaining = res.headers.get("x-ratelimit-remaining");
    const limit = res.headers.get("x-ratelimit-limit");
    if (remaining !== null) setRateLimit({ remaining, limit });
    if (!res.ok) {
      if (res.status === 404) throw new Error("NOT_FOUND");
      if (res.status === 403) throw new Error("RATE_LIMITED");
      throw new Error(`GitHub API error: ${res.status}`);
    }
    return res.json();
  }

  async function runScan(e) {
    e.preventDefault();
    const uname = username.trim();
    if (!uname) return;

    setLoading(true);
    setError(null);
    setProfile(null);
    setOrgs([]);
    setEmails([]);
    setEvents([]);
    setContributions(null);
    setLanguages([]);
    setBestRepos([]);
    setReposScanned(0);

    try {
      setProgress("fetching profile...");
      const user = await ghFetch(`/users/${uname}`);
      setProfile(user);

      ghFetch(`/users/${uname}/orgs`).then(setOrgs).catch(() => setOrgs([]));
      ghFetch(`/users/${uname}/events/public?per_page=10`).then(setEvents).catch(() => setEvents([]));
      fetchContributions(uname).then(setContributions).catch(() => setContributions(null));

      setProgress("listing repositories...");
      const repos = await ghFetch(`/users/${uname}/repos?per_page=50&sort=pushed&direction=desc`);
      const ownRepos = repos.filter((r) => !r.fork);

      setLanguages(topLanguages(ownRepos));
      setBestRepos(topRepos(ownRepos));

      const scanTargets = ownRepos.slice(0, 15);
      const hits = [];
      for (let i = 0; i < scanTargets.length; i++) {
        const repo = scanTargets[i];
        setProgress(`scanning commits ${i + 1}/${scanTargets.length}: ${repo.name}`);
        try {
          const commits = await ghFetch(`/repos/${uname}/${repo.name}/commits?per_page=30`);
          for (const c of commits) {
            const aEmail = c.commit?.author?.email;
            const cEmail = c.commit?.committer?.email;
            if (aEmail) hits.push({ email: aEmail, repo: repo.name });
            if (cEmail) hits.push({ email: cEmail, repo: repo.name });
          }
        } catch (err) {
          if (err.message === "RATE_LIMITED") break;
        }
      }
      setReposScanned(scanTargets.length);
      setEmails(aggregate(hits, user.email));
    } catch (err) {
      if (err.message === "NOT_FOUND") setError(`No GitHub user named "${uname}".`);
      else if (err.message === "RATE_LIMITED")
        setError("GitHub rate limit hit. Add a personal access token below for a much higher limit.");
      else setError(err.message);
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  return (
    <main className="page">
      <header className="header">
        <h1>./ghscanner</h1>
        <p className="sub">
          Pulls public profile, activity, and commit-metadata emails for a GitHub username.
        </p>
      </header>

      <form className="searchbar" onSubmit={runScan}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="torvalds"
          autoComplete="off"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Scanning..." : "Scan"}
        </button>
      </form>

      <TokenInput token={token} setToken={setToken} />

      {progress && <p className="progress">{progress}</p>}
      {error && <p className="errorMsg">{error}</p>}
      {rateLimit && (
        <p className="rateLimit">API quota: {rateLimit.remaining}/{rateLimit.limit} remaining</p>
      )}

      {profile && <ProfileCard user={profile} orgs={orgs} />}
      {profile && <ContributionChart data={contributions} />}
      {profile && <EmailResults username={username} emails={emails} reposScanned={reposScanned} />}
      {profile && <LanguageChart languages={languages} />}
      {profile && <TopRepos repos={bestRepos} />}
      {profile && <ActivityFeed events={events} />}

      {profile && (
        <p className="disclaimer">
          Emails come from public commit metadata ,Addresses ending in @users.noreply.github.com mean the
          user opted into GitHub's email privacy. Use this for legitimate
          purposes only - see our <a href="/terms">terms</a>.
        </p>
      )}
    </main>
  );
}
