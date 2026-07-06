import { accountAge } from "../lib/github";

export default function ProfileCard({ user, orgs }) {
  return (
    <section className="card profileCard">
      <img className="avatar" src={user.avatar_url} alt={`${user.login} avatar`} loading="lazy" />
      <div className="profileInfo">
        <div className="nameRow">
          <span className="name">{user.name || user.login}</span>
          <span className="handle">@{user.login}</span>
          {user.hireable && <span className="badge hireBadge">open to work</span>}
        </div>
        {user.bio && <p className="bio">{user.bio}</p>}

        <div className="statRow">
          <Stat label="repos" value={user.public_repos} />
          <Stat label="followers" value={user.followers} />
          <Stat label="following" value={user.following} />
          <Stat label="gists" value={user.public_gists} />
        </div>

        <div className="metaRow">
          {user.company && <span><i className="tag">company</i> {user.company}</span>}
          {user.location && <span><i className="tag">location</i> {user.location}</span>}
          {user.blog && (
            <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer">
              <i className="tag">site</i> {user.blog}
            </a>
          )}
          <span><i className="tag">joined</i> {new Date(user.created_at).toLocaleDateString()} ({accountAge(user.created_at)})</span>
        </div>

        {orgs && orgs.length > 0 && (
          <div className="orgRow">
            {orgs.map((o) => (
              <a key={o.id} href={`https://github.com/${o.login}`} target="_blank" rel="noreferrer" className="orgChip">
                <img src={o.avatar_url} alt="" width="16" height="16" />
                {o.login}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="statValue">{value ?? 0}</span>
      <span className="statLabel">{label}</span>
    </div>
  );
}
