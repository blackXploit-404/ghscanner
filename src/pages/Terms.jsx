import useSeo from "../lib/useSeo";

export default function Terms() {
  useSeo({
    title: "Terms of use",
    description: "Acceptable use terms for ghscanner: legitimate research and outreach only, no spam, no harassment, no bulk scraping.",
    path: "/terms",
  });

  return (
    <main className="page textPage">
      <h1>Terms of use</h1>

      <h2>Acceptable use</h2>
      <p>This tool is provided for:</p>
      <ul>
        <li>Checking your own public GitHub exposure.</li>
        <li>Legitimate security research.(OSINT)</li>
        <li>Professional outreach where you already have a lawful basis to contact someone (e.g. recruiting, open-source collaboration).</li>
      </ul>

      <h2>Prohibited use</h2>
      <p>You may not use this tool to:</p>
      <ul>
        <li>Send unsolicited bulk email (spam) to addresses found here.</li>
        <li>Harass, stalk, or dox any individual.</li>
        <li>Attempt to bulk-scrape, enumerate, or automate lookups against many usernames.</li>
        <li>Circumvent GitHub's own rate limits or terms of service.</li>
      </ul>

      <h2>No warranty</h2>
      <p>
        Information shown may be inaccurate, incomplete, or outdated - it
        reflects public commit metadata at the time of the scan, not a
        verified or current contact method. We make no guarantee of
        accuracy and are not responsible for decisions made based on this
        tool's output.
      </p>

      <h2>GitHub's terms still apply</h2>
      <p>
        Your use of GitHub's API through this tool remains subject to{" "}
        <a href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service" target="_blank" rel="noreferrer">
          GitHub's own Terms of Service
        </a>.
      </p>

      <h2>Enforcement</h2>
      <p>
        We reserve the right to rate-limit, block, or deny access to anyone
        we believe is using this tool for a prohibited purpose.
      </p>
    </main>
  );
}
