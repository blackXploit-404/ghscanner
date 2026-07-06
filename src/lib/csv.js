export function downloadEmailsCsv(username, emails) {
  const header = "email,confidence,kind,occurrences,repos\n";
  const rows = emails
    .map((e) =>
      [
        e.email,
        e.confidence,
        e.kind,
        e.occurrences,
        `"${e.repos.join("; ")}"`,
      ].join(",")
    )
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${username}-github-emails.csv`;
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
