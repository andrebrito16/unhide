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

Used plasmo framework with Typescript, React and TailwindCss.

