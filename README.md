# ghscanner [ beta ]

**Current release:** `v0.3.0` · See [CHANGELOG.md](./CHANGELOG.md) for the release history.

ghscanner is a simple tool that looks up a GitHub username and shows what's publicly visible about that account: profile info, activity, contribution history, and any email addresses left in public commit metadata.

![preview image](./public/images/preview.png)

## Why I built this?

Well, when I do some OSINT stuff, it's hard to find email IDs because lots of users on GitHub make it private. The thing is that before making it private, many users (including me) pushed code using their own personal email ID. It isn't a big security issue, but for looking these from GitHub OSINT purposes would take hours. Many tools available on the internet (web-based) don't work perfectly, showing no-reply email, "could not find email," and bla bla stuff. So I built this instead.

## Setup is simple

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
```

## How it works?

ghscanner leverages GitHub's public API and scrapes commit metadata to find email addresses that users may have accidentally exposed through their commit history. Here's the process:

- **Fetch User Profile** - Retrieves public profile information
- **Scan Commit History** - Analyzes public commit data across repositories to extract email addresses from commit metadata
- **Detect Secrets & Tokens** - Inspects added lines in available public commit patches for common credential patterns, including GitHub, AWS, Slack, Google, Stripe, SendGrid, JWT, private keys, and generic secret assignments
- **Filter & Validate** - Filters out GitHub's noreply email addresses, validates real email formats, and labels secret matches as potential exposures
- **Display Results** - Presents evidence, severity, source locations, and masked findings in a clean, organized interface
- **Download** - You can download email evidence and masked secret findings as CSV files, plus JSON email reports.
## Disclaimer

Secret detection is pattern-based and may produce false positives. It only scans added lines from public commit patches available through GitHub's API, and full matched credential values are never displayed or exported.

This tool is built for **educational and OSINT research purposes only**. All information gathered is publicly available on GitHub. Always respect:

- GitHub's Terms of Service
- Individual privacy rights
- Ethical guidelines for OSINT

**Don't use this tool for:**

- Send unsolicited bulk email (spam) to addresses found here.
- Harass, stalk, or dox any individual.
- Attempt to bulk-scrape, enumerate, or automate lookups against many usernames.
- Circumvent GitHub's own rate limits or terms of service.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/yourpreferednamehere`)
3. Commit changes (`git commit -m 'Add name here'`)
4. Push to branch (`git push origin feature/name here`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Acknowledgments

- GitHub for providing the API
- [github-contributions-api.jogruber.de](https://github-contributions-api.jogruber.de)

## Contact

**Surajit S.** - [@getsensurajit](https://twitter.com/getsensurajit) - sensurajit@proton.me

Project Link: [https://github.com/blackxploit-404/ghscanner](https://github.com/blackxploit-404/ghscanner)

---

**Happy OSINTing! 🔍**
