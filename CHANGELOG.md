# Changelog

All notable changes to ghscanner are documented here. The project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

This section is for changes that have not been released yet.

## [0.3.0] - 2026-08-26

This release makes scan results easier to verify and reuse.

### Added

- Email findings now include their source repository, commit, date, and whether the address came from author or committer metadata.
- The results view now presents an exposure summary with real-domain, noreply, bot, and inspected-commit counts.
- CSV exports include the evidence behind each finding.
- JSON reports can be downloaded for scripts, security notes, and later review.
- Partial scans are called out clearly when GitHub rate limits interrupt the commit lookup.

### Changed

- The results section is now presented as an exposure audit rather than an unexplained email list.
- Confidence labels are backed by occurrence and source information that can be checked in the report.
- Export filenames now use the `github-exposure-audit` name so they are easier to identify.

### Notes

The scanner only reports public GitHub profile and commit metadata seen during the current scan. A result is evidence that a value was publicly visible; it is not a claim about current ownership, activity, or email deliverability.

## [0.2.0]

The beta release provided the original profile lookup experience, including public profile details, activity, contribution history, repository and language summaries, commit-metadata email discovery, personal access token support, and CSV export.

[Unreleased]: https://github.com/blackXploit-404/ghscanner/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/blackXploit-404/ghscanner/releases/tag/v0.3.0
[0.2.0]: https://github.com/blackXploit-404/ghscanner/releases/tag/v0.2.0
