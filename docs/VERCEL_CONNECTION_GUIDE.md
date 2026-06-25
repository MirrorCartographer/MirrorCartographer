# Vercel Connection Guide

This repository is ready to deploy through Vercel, but the current assistant session only has GitHub access. Vercel connection must be completed from the Vercel dashboard by an account with access to the Vercel project/team.

## Current verified state

GitHub repository:

https://github.com/MirrorCartographer/MirrorCartographer

Repository visibility: public.

Framework: Next.js.

Build script in `package.json`:

- `npm run build` -> `next build`

Vercel status checks are attached to GitHub, which means at least one Vercel project is already watching this repository.

The current deployment failure visible from GitHub points to a Vercel build-rate-limit / upgrade page, not a normal code-error page.

## What Vercel connection requires

Vercel deploys Git repositories by connecting to a Git provider such as GitHub. Once connected, Vercel creates preview deployments for pushes and production deployments for the production branch, usually `main`.

To connect this project cleanly:

1. Log into Vercel.
2. Open the dashboard.
3. Select New Project.
4. Import the GitHub repository: `MirrorCartographer/MirrorCartographer`.
5. Use the Next.js framework preset.
6. Root directory: repository root.
7. Build command: `npm run build`.
8. Install command: `npm install`.
9. Output directory: leave default for Next.js.
10. Production branch: `main`.
11. Deploy.

## Important cleanup

GitHub currently shows multiple Vercel status contexts with similar names:

- `mirrorcartog`
- `mirrorcartographerr`
- `mirrorcartographer`
- `mirror-cartographer`

This suggests duplicate Vercel projects may be connected to the same GitHub repository.

Recommended cleanup:

1. In Vercel, open each duplicate project.
2. Keep only the intended production project.
3. Disconnect or delete duplicate projects that point to this same GitHub repository.
4. Keep one clean project name, preferably `mirror-cartographer`.
5. Redeploy from the latest `main` commit.

## Build-rate-limit issue

If Vercel shows a build-rate-limit / upgrade page, code changes alone will not fix deployment.

Possible actions:

- wait for the build limit window to reset
- reduce duplicate connected projects so every GitHub push does not trigger multiple builds
- delete failed duplicate Vercel projects
- upgrade the Vercel plan if needed
- use manual deployment after the limit resets

## Manual redeploy after cleanup

Once the duplicate projects are cleaned up or the build limit resets:

1. Open the chosen Vercel project.
2. Go to Deployments.
3. Choose Create Deployment or Redeploy latest production deployment.
4. Select branch `main` or the latest commit.
5. Deploy.

## What this repository now provides

The repo contains the product demo and deployment-ready source code. It also contains documentation for:

- public README
- final status
- interrogation audit
- research-grounded fix plan
- evaluation packet
- demo test set
- roadmap

## What cannot be done from GitHub alone

GitHub can update the code, but cannot clear Vercel account build limits or remove duplicate Vercel project connections from the Vercel dashboard.

A Vercel account owner must complete dashboard-side cleanup and redeploy.