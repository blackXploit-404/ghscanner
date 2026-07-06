import useSeo from "../lib/useSeo";

export default function About() {
  useSeo({
    title: "About",
    description: "How ghscanner works: it reads public commit metadata that GitHub already exposes via git and its API - nothing private.",
    path: "/about",
  });

  return (
    <main className="page textPage">
      <h1>About ghscanner</h1>
      <p>
        ghscanner looks up a GitHub username and shows what's publicly
        visible about that account: profile info, activity, contribution
        history, and any email addresses left in public commit metadata.
      </p>
      <h2>Why i build this ?</h2>
      well , when i do some osint stuffs its hard to find email id's because lots of users on github make it private and the thing is that before making it private many users including me as well pushed code using own perosnal email id which isnt a big security issue
      but for looking these from github osint purposes would take hours and many tools available on the internet ( web based ) doesnt work perfectly showing no-reply email , could not find email and bla bla stuffs so i built this instead.

      <h2>Why commit emails show up at all</h2>
      <p>
        Every git commit carries an author email in its metadata. Unless a
        person configures GitHub's "keep my email address private" setting -
        which replaces it with an anonymous
        <code> @users.noreply.github.com</code> address - that real email is
        visible to anyone who runs <code>git log</code> against a public
        repository, or queries GitHub's own API. This tool automates
        collecting and de-duplicating those addresses; it doesn't access
        anything that wasn't already public.
      </p>

      <h2>What it doesn't do</h2>
      <ul>
        <li>No bulk lookups or username enumeration - one username at a time.</li>
        <li>No permanent public database of scanned users or emails.</li>
        <li>No storage of any personal access token you provide - see our <a href="/privacy">privacy page</a>.</li>
      </ul>

      <h2>Intended use</h2>
      <p>
        Verifying your own exposure, security research, and legitimate
        professional outreach. Not for spam, harassment, or contacting
        people who've deliberately kept their address private. See our{" "}
        <a href="/terms">terms of use</a>.
      </p>
    </main>
  );
}
