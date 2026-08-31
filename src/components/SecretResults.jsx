import { secretSummary } from "../lib/secrets";
import { downloadSecretsCsv } from "../lib/csv";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";
}

export default function SecretResults({ username, findings, scanMeta }) {
  const summary = secretSummary(findings);

  return (
    <section className="card secretCard">
      <div className="cardHeaderRow">
        <div>
          <h2>Secrets & tokens</h2>
          <p className="sectionLead">Pattern matches in added lines of public commit patches. Values are permanently masked.</p>
        </div>
        {findings.length > 0 && (
          <button className="smallBtn" onClick={() => downloadSecretsCsv(username, findings)} type="button">
            CSV
          </button>
        )}
      </div>

      <div className="auditSummary secretSummary" aria-label="Secret scan summary">
        <div><strong>{summary.total}</strong><span>potential findings</span></div>
        <div><strong>{summary.critical}</strong><span>critical</span></div>
        <div><strong>{summary.high}</strong><span>high</span></div>
        <div><strong>{scanMeta?.patchesInspected || 0}</strong><span>patches inspected</span></div>
      </div>

      {findings.length === 0 ? (
        <p className="muted">No supported secret or token patterns were detected in the inspected commit patches.</p>
      ) : (
        <div className="tableWrap">
          <table>
            <thead><tr><th>Type</th><th>Severity</th><th>Masked evidence</th><th>Location</th><th>Observed</th></tr></thead>
            <tbody>
              {findings.map((finding, index) => (
                <tr key={`${finding.sha}-${finding.file}-${finding.line}-${index}`}>
                  <td><strong>{finding.type}</strong><small className="muted">{finding.status}</small></td>
                  <td><span className={`secretSeverity severity-${finding.severity}`}>{finding.severity}</span></td>
                  <td><code>{finding.maskedValue}</code></td>
                  <td className="evidenceCell">
                    <span>{finding.file}:{finding.line}</span>
                    {finding.commitUrl && <a href={finding.commitUrl} target="_blank" rel="noreferrer">view commit</a>}
                    <small>{finding.repo}</small>
                  </td>
                  <td>{formatDate(finding.observedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="remediationBox">
        <strong>What to do if this is your repository</strong>
        <span>Revoke or rotate the credential immediately, remove it from the source, and review access logs. A commit deletion does not guarantee removal from forks, clones, or caches.</span>
      </div>
      <p className="auditNote">These are potential matches, not proof that a credential is active. ghscanner never displays or exports the full matched value.</p>
    </section>
  );
}
