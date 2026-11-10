# GitHub Developer Program — Readiness Record

## Official eligibility

GitHub states that the Developer Program is open to individual developers and companies that have:
- an integration in production or development using the GitHub API; and
- an email address where GitHub users can contact the developer for support.

Official guidance: https://docs.github.com/en/integrations/concepts/github-developer-program

## Integration built

**Project:** GitHub Field Kit  
**Location:** `public/tools/github-field-kit.html`  
**API:** GitHub REST API v3, public unauthenticated endpoints  
**Functions:** inspect a public repository, show stars/forks/watchers/issues, list open pull requests and issues, and show recent commits.  
**Data handling:** no GitHub token is requested, collected, or stored. The app performs read-only public API requests from the browser.

## Application readiness

- [x] Working API integration implemented in repository source.
- [ ] Public GitHub Pages deployment verified.
- [ ] Public support email selected and published with owner consent.
- [ ] Browser test completed against at least two public repositories.
- [ ] API rate-limit and error states reviewed.
- [ ] Developer Program application submitted by account owner.
- [ ] Program acceptance confirmed.

## Current state

The integration exists in development. Public deployment and support-contact requirements still need verification. The connected GitHub profile email is not automatically treated as a public support address; the project owner must explicitly choose what address to publish.

## Application

Apply through the official GitHub Developer Program page linked from GitHub's documentation. The account owner must review and accept the Registered Developer Agreement and current program terms. This repository does not claim membership until GitHub confirms registration.

## Public presentation

The application should be described accurately as a read-only GitHub REST API repository explorer. It does not write to GitHub, merge pull requests, alter issues, or access private repositories.
