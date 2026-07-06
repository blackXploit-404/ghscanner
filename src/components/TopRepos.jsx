export default function TopRepos({ repos }) {
  if (!repos || repos.length === 0) return null;

  return (
    <section className="card">
      <h2>Top repositories</h2>
      <ul className="repoList">
        {repos.map((r) => (
          <li key={r.id}>
            <a href={r.html_url} target="_blank" rel="noreferrer">{r.name}</a>
            <span className="muted"> · {r.stargazers_count} stars</span>
            {r.description && <p className="repoDesc muted">{r.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
