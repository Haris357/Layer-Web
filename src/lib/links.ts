// Public Layer release channel — the website links here for downloads.
const RELEASES = 'https://github.com/Haris357/Layer-releases'
const STORE_ID = '9NL577X16L1N'

export const LINKS = {
  repo: RELEASES,
  releasesPage: `${RELEASES}/releases/latest`,
  // Stable-named installer asset, republished on every release.
  download: `${RELEASES}/releases/latest/download/Layer-Setup.exe`,
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
