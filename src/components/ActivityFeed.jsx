import { timeAgo, EVENT_LABELS } from "../lib/github";

export default function ActivityFeed({ events }) {
  return (
    <section className="card">
      <h2>Last activity</h2>
      {events.length === 0 ? (
        <p className="muted">No public activity found.</p>
      ) : (
        <ul className="activityList">
          {events.slice(0, 8).map((ev) => (
            <li key={ev.id}>
              <span className="muted">{timeAgo(ev.created_at)}</span>{" "}
              {EVENT_LABELS[ev.type] || ev.type}{" "}
              <strong>{ev.repo?.name}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
