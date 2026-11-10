# Remove Unwanted GitHub Integrations

**Purpose:** remove Vercel and Netlify GitHub integrations from the MirrorCartographer account so they no longer add deployment checks or receive repository events.

## Important distinction

Deleting `vercel.json`, `netlify.toml`, workflow references, or deployment configuration from a repository does not uninstall a GitHub App. Uninstalling a GitHub App is an account-level action.

## Account-level uninstall launcher

Open GitHub's installed-app settings:

https://github.com/settings/installations

For each unwanted provider integration:
1. Confirm the app name is exactly **Vercel** or **Netlify**.
2. Open its configuration.
3. Review which repositories it can access.
4. Choose **Uninstall** and confirm.
5. Return to the repository's pull request checks and verify that new provider checks stop appearing.

Do not uninstall the GitHub integration used to manage this repository unless you intend to revoke this automation's access as well.

## Provider-side cleanup

After removing the GitHub App, review the provider account's Git integration settings and disconnect any remaining repository connections. Removing the GitHub App may not delete existing provider projects or deployments.

- Vercel: https://vercel.com/account
- Netlify: https://app.netlify.com/user/applications

## Why this is a guided action

GitHub's API endpoint for deleting an app installation requires a GitHub App JWT belonging to that app. A normal repository token or the connected repository integration cannot safely uninstall a different provider's app. This project therefore links to GitHub's authenticated settings UI rather than pretending it can revoke another app's installation.

## Verification checklist

- [ ] Vercel GitHub App no longer appears in installed apps.
- [ ] Netlify GitHub App no longer appears in installed apps.
- [ ] Provider-side repository connections are disconnected.
- [ ] No new Vercel/Netlify status checks appear on a fresh test PR.
- [ ] Remaining deployment path is explicitly documented and tested.
