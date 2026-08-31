function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function downloadEmailsCsv(username, emails) {
  const header = [
    "email",
    "confidence",
    "kind",
    "occurrences",
    "repos",
    "source_role",
    "source_repo",
    "commit_sha",
    "commit_url",
    "observed_at",
  ].join(",");

  const rows = emails.flatMap((email) => {
    const evidence = email.evidence?.length ? email.evidence : [{}];
    return evidence.map((source) =>
      [
        email.email,
        email.confidence,
        email.kind,
        email.occurrences,
        email.repos.join("; "),
        source.role,
        source.repo,
        source.sha,
        source.commitUrl,
        source.observedAt,
      ].map(csvCell).join(",")
    );
  });

  const blob = new Blob([[header, ...rows].join("\n") + "\n"], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${username}-github-exposure-audit.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadSecretsCsv(username, findings) {
  const header = ["type", "severity", "masked_value", "file", "line", "repository", "commit_sha", "commit_url", "observed_at"].join(",");
  const rows = findings.map((finding) => [
    finding.type,
    finding.severity,
    finding.maskedValue,
    finding.file,
    finding.line,
    finding.repo,
    finding.sha,
    finding.commitUrl,
    finding.observedAt,
  ].map(csvCell).join(","));
  const blob = new Blob([[header, ...rows].join("\n") + "\n"], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${username}-github-secret-audit.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadEmailsJson(username, emails) {
  const report = {
    tool: "ghscanner",
    version: "0.3.0",
    username,
    generatedAt: new Date().toISOString(),
    results: emails,
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${username}-github-exposure-audit.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
