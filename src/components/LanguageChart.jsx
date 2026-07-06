export default function LanguageChart({ languages }) {
  if (!languages || languages.length === 0) return null;
  const max = languages[0][1];

  return (
    <section className="card">
      <h2>Top languages</h2>
      <div className="langList">
        {languages.map(([lang, count]) => (
          <div className="langRow" key={lang}>
            <span className="langName">{lang}</span>
            <div className="langBarTrack">
              <div className="langBarFill" style={{ width: `${(count / max) * 100}%` }} />
            </div>
            <span className="langCount">{count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
