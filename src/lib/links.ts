// Public Layer release channel — the website links here for downloads.
const RELEASES = 'https://github.com/Haris357/Layer-releases'
const STORE_ID = '9NL577X16L1N'

export const LINKS = {
  repo: RELEASES,
  releasesPage: `${RELEASES}/releases/latest`,
  // Stable-named installer assets, republished on every release.
  download: `${RELEASES}/releases/latest/download/Layer-Setup.exe`,
  // Native ARM64 build (Snapdragon / Surface Pro X etc.) — no x64 emulation.
  downloadArm64: `${RELEASES}/releases/latest/download/Layer-Setup-arm64.exe`,
  // Microsoft Store — the primary, recommended way to get Layer.
  store: `https://apps.microsoft.com/detail/${STORE_ID}`,
  storeDeepLink: `ms-windows-store://pdp/?productid=${STORE_ID}`,
  haris: {
    portfolio: 'https://harisjangdaa.web.app/',
    linkedin: 'https://www.linkedin.com/in/harisjangda/',
    github: 'https://github.com/haris357',
    twitter: 'https://x.com/HarisMImran',
  },
}
