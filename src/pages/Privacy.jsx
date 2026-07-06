import useSeo from "../lib/useSeo";

export default function Privacy() {
  useSeo({
    title: "Privacy policy",
    description: "What ghscanner does and doesn't store: no accounts, no server-side token storage, no permanent database of scanned results.",
    path: "/privacy",
  });

  return (
    <main className="page textPage">
      <h1>Privacy policy</h1>
      <p><em>Last updated: 6 July 2026</em></p>

      <h2>What we don't collect</h2>
      <ul>
        <li>We don't require an account, email, or any signup to use this tool.</li>
        <li>We don't store your GitHub personal access token or AKA PAT anywhere on a server. If you provide one, it's sent directly from your browser to api.github.com and, at most, kept in your browser's session storage for that tab - never transmitted to us.</li>
        <li>We don't maintain a permanent, searchable database of usernames or emails that have been looked up. but for speedup search result </li>
      </ul>

      <h2>What happens when you run a scan</h2>
      <p>
        Your browser calls GitHub's public API directly. GitHub's own privacy
        policy governs that request. in future If this tool has a caching layer, scan
        results may be cached temporarily (typically on the order of hours)
        purely to reduce repeated API calls, and expire automatically.
      </p>

      <h2>Third-party services used</h2>
      <p>
        Contribution history is retrieved from a third-party public API
        (github-contributions-api.jogruber.de) since GitHub's own REST API
        doesn't expose it. No personal data is sent to that service beyond
        the username you searched.
      </p>

      <h2>Requesting removal</h2>
      <p>
        If you find your information here and want it removed from any
        cache we maintain, contact us at{" "}
        <a href="mailto:sensurajit@proton.me">sensurajit@proton.me</a> with the
        username in question.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If this tool starts storing more than described above (accounts,
        tokens, persistent history), this page will be updated to reflect
        that before the change ships.
      </p>
    </main>
  );
}
