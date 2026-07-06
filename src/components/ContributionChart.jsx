export default function ContributionChart({ data }) {
  if (!data) return null;
  const days = data.contributions || [];
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <section className="card">
      <h2>Contributions ({data.total?.lastYear ?? "?"} in the last year)</h2>
      <div className="heatmap">
        {weeks.map((week, wi) => (
          <div className="heatmapCol" key={wi}>
            {week.map((day, di) => (
              <div
                key={di}
                className={`heatCell level-${day.level ?? 0}`}
                title={`${day.date}: ${day.count} contribution(s)`}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
