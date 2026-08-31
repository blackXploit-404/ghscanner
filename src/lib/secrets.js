const SECRET_PATTERNS = [
  {
    type: "AWS access key",
    severity: "critical",
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    type: "GitHub token",
    severity: "critical",
    regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{22,255}\b/g,
  },
  {
    type: "Slack token",
    severity: "high",
    regex: /\bxox[baprs]-[0-9A-Za-z-]{10,200}\b/g,
  },
  {
    type: "Google API key",
    severity: "high",
    regex: /\bAIza[0-9A-Za-z_-]{35}\b/g,
  },
  {
    type: "Stripe secret key",
    severity: "critical",
    regex: /\bsk_(?:live|test)_[0-9A-Za-z]{16,}\b/g,
  },
  {
    type: "SendGrid API key",
    severity: "high",
    regex: /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/g,
  },
  {
    type: "Private key",
    severity: "critical",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
  },
  {
    type: "JWT",
    severity: "high",
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    type: "Generic secret assignment",
    severity: "high",
    regex: /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|secret[_-]?key|password)\s*[:=]\s*["']([^"'\s]{8,})["']/gi,
  },
];

const SEVERITY_SCORE = { critical: 3, high: 2, medium: 1 };

function maskSecret(value) {
  if (!value) return "[redacted]";
  if (value.length <= 8) return `${value.slice(0, 2)}…[redacted]`;
  return `${value.slice(0, 4)}…${value.slice(-3)}`;
}

function addedLines(patch = "") {
  return patch
    .split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .join("\n");
}

export function detectSecretsFromPatch(patch, context = {}) {
  const text = addedLines(patch);
  const findings = [];
  for (const pattern of SECRET_PATTERNS) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      const raw = match[1] || match[0];
      const line = text.slice(0, match.index).split("\n").length;
      findings.push({
        type: pattern.type,
        severity: pattern.severity,
        maskedValue: maskSecret(raw),
        line,
        file: context.file || "unknown file",
        repo: context.repo,
        repoUrl: context.repoUrl,
        sha: context.sha,
        commitUrl: context.commitUrl,
        observedAt: context.observedAt,
        status: "potential exposure",
      });
      if (findings.length >= 100) return findings;
    }
  }
  return findings;
}

export function aggregateSecretFindings(findings) {
  const map = new Map();
  for (const finding of findings) {
    const key = [finding.type, finding.repo, finding.sha, finding.file, finding.line].join("|");
    if (!map.has(key)) map.set(key, finding);
  }
  return [...map.values()].sort(
    (a, b) => (SEVERITY_SCORE[b.severity] || 0) - (SEVERITY_SCORE[a.severity] || 0)
  );
}

export function secretSummary(findings) {
  return findings.reduce(
    (summary, finding) => {
      summary.total += 1;
      summary[finding.severity] = (summary[finding.severity] || 0) + 1;
      return summary;
    },
    { total: 0, critical: 0, high: 0, medium: 0 }
  );
}

export function secretPatterns() {
  return SECRET_PATTERNS.map(({ type, severity }) => ({ type, severity }));
}
