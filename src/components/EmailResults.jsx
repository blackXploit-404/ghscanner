import { useState } from "react";
import { confidenceFor, emailDomain } from "../lib/github";
import { copyToClipboard, downloadEmailsCsv, downloadEmailsJson } from "../lib/csv";

function formatDate(value) {
  if (!value) return "profile source";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function EmailResults({ username, emails, reposScanned, scanMeta }) {
  const [copiedEmail, setCopiedEmail] = useState(null);
  const scored = emails.map((e) => ({ ...e, confidence: confidenceFor(e) }));
  const realCount = scored.filter((e) => e.kind === "real").length;
  const noreplyCount = scored.filter((e) => e.kind === "noreply").length;
  const botCount = scored.filter((e) => e.kind === "bot").length;

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
        <h2>Scan results</h2>
        {scored.length > 0 && (
          <div className="exportActions">
            <button className="smallBtn" onClick={() => downloadEmailsCsv(username, scored)} type="button">
              CSV
            </button>
            <button className="smallBtn" onClick={() => downloadEmailsJson(username, scored)} type="button">
              JSON
            </button>
          </div>
        )}
      </div>

      {scanMeta && (
        <div className="auditSummary" aria-label="Scan summary">
          <div><strong>{realCount}</strong><span>real-domain</span></div>
          <div><strong>{noreplyCount}</strong><span>noreply</span></div>
          <div><strong>{botCount}</strong><span>bot</span></div>
          <div><strong>{scanMeta.commitsInspected}</strong><span>commits inspected</span></div>
        </div>
      )}

      {scanMeta?.partial && (
        <p className="partialNotice">
          Partial scan: GitHub rate limits stopped the commit scan early. Add a token and scan again for wider coverage.
        </p>
      )}

      {scored.length === 0 ? (
        <p className="muted">No email addresses found in the scanned public sources.</p>
      ) : (
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Confidence</th>
                <th>Hits</th>
                <th>Evidence</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {scored.map((e) => {
                const evidence = e.evidence?.[0];
                return (
                  <tr key={e.email}>
                    <td>
                      <span>{e.email}</span>
                      <span className="domainTag">{emailDomain(e.email)}</span>
                      {e.fromProfile && <span className="badge profileBadge">profile</span>}
                      {e.kind === "noreply" && <span className="badge noreplyBadge">noreply</span>}
                      {e.kind === "bot" && <span className="badge botBadge">bot</span>}
                    </td>
                    <td>
                      <span className={`confidence confidence-${e.confidence}`}>{e.confidence}</span>
                    </td>
                    <td>{e.occurrences}</td>
                    <td className="evidenceCell">
                      {evidence?.commitUrl ? (
                        <a href={evidence.commitUrl} target="_blank" rel="noreferrer">
                          {evidence.role} · {formatDate(evidence.observedAt)}
                        </a>
                      ) : (
                        <span className="muted">{evidence?.role || "—"}</span>
                      )}
                      {evidence?.repoUrl && (
                        <small>{evidence.repoUrl.replace("https://github.com/", "")}</small>
                      )}
                    </td>
                    <td>
                      <button className="iconBtn" onClick={() => handleCopy(e.email)} type="button">
                        {copiedEmail === e.email ? "copied" : "copy"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="auditNote">
        Findings are limited to public profile and commit metadata observed in this scan. A result is evidence of exposure, not proof of current ownership or deliverability.
      </p>
    </section>
  );
}
