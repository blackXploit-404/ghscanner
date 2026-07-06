import { useState } from "react";
import { confidenceFor, emailDomain } from "../lib/github";
import { copyToClipboard, downloadEmailsCsv } from "../lib/csv";

export default function EmailResults({ username, emails, reposScanned }) {
  const [copiedEmail, setCopiedEmail] = useState(null);
  const scored = emails.map((e) => ({ ...e, confidence: confidenceFor(e) }));

  async function handleCopy(email) {
    const ok = await copyToClipboard(email);
    if (ok) {
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 1500);
    }
  }

  return (
    <section className="card">
      <div className="cardHeaderRow">
        <h2>Emails found ({reposScanned} repo{reposScanned === 1 ? "" : "s"} scanned)</h2>
        {scored.length > 0 && (
          <button className="smallBtn" onClick={() => downloadEmailsCsv(username, scored)} type="button">
            Export CSV
          </button>
        )}
      </div>

      {scored.length === 0 ? (
        <p className="muted">No emails found in scanned commits.</p>
      ) : (
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Confidence</th>
                <th>Hits</th>
                <th>Source repos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {scored.map((e) => (
                <tr key={e.email}>
                  <td>
                    {e.email}
                    <span className="domainTag">{emailDomain(e.email)}</span>
                    {e.fromProfile && <span className="badge profileBadge">profile</span>}
                    {e.kind === "noreply" && <span className="badge noreplyBadge">noreply</span>}
                    {e.kind === "bot" && <span className="badge botBadge">bot</span>}
                  </td>
                  <td>
                    <span className={`confidence confidence-${e.confidence}`}>{e.confidence}</span>
                  </td>
                  <td>{e.occurrences}</td>
                  <td className="muted">{e.repos.join(", ") || "—"}</td>
                  <td>
                    <button className="iconBtn" onClick={() => handleCopy(e.email)} type="button">
                      {copiedEmail === e.email ? "copied" : "copy"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
