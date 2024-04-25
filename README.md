<h1 align="center">Unhide Extension 🔐</h1>

This is a browser extension focused on security and privacy.
It is designed to show to users what data websites are collecting and storing from them.

![Image](/assets/banner.png)

## Features

Unhides implements the following features:
- Hijacking detection
- Canvas Fingerprint detection
- Cookies count
- Local Storage count
- Automatic security score calculation

## Getting Started

First, run the development server:

```bash
pnpm dev:firefox 
# or
npm run dev:firefox

# Can use pnpm run dev for chrome as well
```

Open your browser and load the appropriate development build. For example, if you are developing for the firefox browser, using manifest v2, use: `build/firefox-mv2-dev`.



## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for unhide extension, ready to be zipped and published to the stores.

## Stack


![Plasmo](https://img.shields.io/badge/-Plasmo-FFD700?style=flat-square&logo=plasmo&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![ReactJs](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](	https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
