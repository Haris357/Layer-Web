// Welcome email — clean, light, minimal, matching the Layer site.
// Files prefixed with "_" are helpers, not routed by Vercel.

const LINKS = {
  download:
    'https://github.com/Haris357/Layer-releases/releases/latest/download/Layer-Setup.exe',
  store: 'https://apps.microsoft.com/detail/9NL577X16L1N',
  repo: 'https://github.com/Haris357/Layer-releases',
  portfolio: 'https://harisjangdaa.web.app/',
  linkedin: 'https://www.linkedin.com/in/harisjangda/',
  github: 'https://github.com/haris357',
  twitter: 'https://x.com/HarisMImran',
}

function welcomeEmail() {
  const font =
    "-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif"
  const ink = '#111111'
  const muted = '#66666b'
  const faint = '#9a9aa0'
  const line = '#ececec'

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:#f4f4f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="540" cellpadding="0" cellspacing="0"
            style="max-width:540px;width:100%;background:#ffffff;border:1px solid ${line};
            border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:40px 44px 8px;font-family:${font};">
                <div style="font-size:19px;font-weight:700;letter-spacing:-0.6px;color:${ink};">
                  Layer
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 44px 0;font-family:${font};">
                <div style="font-size:26px;font-weight:700;letter-spacing:-1.1px;color:${ink};">
                  Thanks for downloading Layer&nbsp;👋
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 44px 0;font-family:${font};">
                <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${muted};">
                  Hey — I'm Haris. I built Layer as a quiet place for widgets to
                  live on your desktop: notes, clocks, weather and more, sitting
                  calmly behind your apps until you need them.
                </p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:${muted};">
                  Your download should be on its way. If it didn't start, you
                  can grab it again below.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 44px 0;font-family:${font};">
                <a href="${LINKS.download}"
                  style="display:inline-block;background:${ink};color:#ffffff;
                  text-decoration:none;font-size:14px;font-weight:600;
                  padding:13px 26px;border-radius:11px;">
                  Download Layer for Windows
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 44px 0;">
                <div style="border-top:1px solid ${line};"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 44px 0;font-family:${font};">
                <p style="margin:0;font-size:15px;line-height:1.6;color:${muted};">
                  If Layer makes your desktop a little nicer, a
                  <a href="${LINKS.repo}" style="color:${ink};font-weight:600;text-decoration:none;">
                    star on GitHub</a>
                  would genuinely mean a lot — it helps more people find it.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 44px 0;font-family:${font};">
                <p style="margin:0;font-size:13px;color:${faint};">Find me around the web</p>
                <p style="margin:7px 0 0;font-size:14px;">
                  <a href="${LINKS.portfolio}" style="color:${muted};text-decoration:none;">Portfolio</a>
                  &nbsp;·&nbsp;
                  <a href="${LINKS.linkedin}" style="color:${muted};text-decoration:none;">LinkedIn</a>
                  &nbsp;·&nbsp;
                  <a href="${LINKS.github}" style="color:${muted};text-decoration:none;">GitHub</a>
                  &nbsp;·&nbsp;
                  <a href="${LINKS.twitter}" style="color:${muted};text-decoration:none;">X</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 44px 40px;font-family:${font};">
                <p style="margin:0;font-size:12px;line-height:1.5;color:${faint};">
                  You're getting this because you downloaded Layer from our
                  website. — made with care by Haris.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

// Announcement — Layer is now on the Microsoft Store. Same visual shell as the
// welcome mail; sent to existing subscribers via the broadcast script.
function storeAnnouncementEmail() {
  const font =
    "-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif"
  const ink = '#111111'
  const muted = '#66666b'
  const faint = '#9a9aa0'
  const line = '#ececec'

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:#f4f4f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="540" cellpadding="0" cellspacing="0"
            style="max-width:540px;width:100%;background:#ffffff;border:1px solid ${line};
            border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:40px 44px 8px;font-family:${font};">
                <div style="font-size:19px;font-weight:700;letter-spacing:-0.6px;color:${ink};">
                  Layer
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 44px 0;font-family:${font};">
                <div style="font-size:26px;font-weight:700;letter-spacing:-1.1px;color:${ink};">
                  Layer is now on the Microsoft Store&nbsp;🎉
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 44px 0;font-family:${font};">
                <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${muted};">
                  Hey — Haris here. Quick bit of good news: Layer is now
                  published on the <strong style="color:${ink};">Microsoft
                  Store</strong>. That means it's Microsoft-verified, so there
                  are no more SmartScreen or antivirus false-positive warnings —
                  just one click to install, and it stays up to date through the
                  Store automatically.
                </p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:${muted};">
                  Already using Layer? You're all set — nothing to do, keep
                  using it as you are. If you ever reinstall or want it on
                  another PC, the Store is now the easiest way.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 44px 0;font-family:${font};">
                <a href="${LINKS.store}"
                  style="display:inline-block;background:${ink};color:#ffffff;
                  text-decoration:none;font-size:14px;font-weight:600;
                  padding:13px 26px;border-radius:11px;">
                  Get Layer on the Microsoft Store
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 44px 0;font-family:${font};">
                <p style="margin:0;font-size:13px;line-height:1.6;color:${faint};">
                  Prefer a plain installer? The direct download is still
                  available
                  <a href="${LINKS.download}" style="color:${muted};font-weight:600;text-decoration:none;">
                    here</a>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 44px 0;">
                <div style="border-top:1px solid ${line};"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 44px 0;font-family:${font};">
                <p style="margin:0;font-size:15px;line-height:1.6;color:${muted};">
                  If Layer makes your desktop a little nicer, a
                  <a href="${LINKS.repo}" style="color:${ink};font-weight:600;text-decoration:none;">
                    star on GitHub</a>
                  (or a quick review on the Store) would genuinely mean a lot.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 44px 0;font-family:${font};">
                <p style="margin:0;font-size:13px;color:${faint};">Find me around the web</p>
                <p style="margin:7px 0 0;font-size:14px;">
                  <a href="${LINKS.portfolio}" style="color:${muted};text-decoration:none;">Portfolio</a>
                  &nbsp;·&nbsp;
                  <a href="${LINKS.linkedin}" style="color:${muted};text-decoration:none;">LinkedIn</a>
                  &nbsp;·&nbsp;
                  <a href="${LINKS.github}" style="color:${muted};text-decoration:none;">GitHub</a>
                  &nbsp;·&nbsp;
                  <a href="${LINKS.twitter}" style="color:${muted};text-decoration:none;">X</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 44px 40px;font-family:${font};">
                <p style="margin:0;font-size:12px;line-height:1.5;color:${faint};">
                  You're getting this because you downloaded Layer from our
                  website. — made with care by Haris.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

// Sign-in code email for Cloud Sync — same visual shell as the welcome mail.
function otpEmail(code) {
  const font =
    "-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif"
  const ink = '#111111'
  const muted = '#66666b'
  const faint = '#9a9aa0'
  const line = '#ececec'

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:#f4f4f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="540" cellpadding="0" cellspacing="0"
            style="max-width:540px;width:100%;background:#ffffff;border:1px solid ${line};
            border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:40px 44px 8px;font-family:${font};">
                <div style="font-size:19px;font-weight:700;letter-spacing:-0.6px;color:${ink};">
                  Layer
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 44px 0;font-family:${font};">
                <div style="font-size:26px;font-weight:700;letter-spacing:-1.1px;color:${ink};">
                  Your sign-in code
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 44px 0;font-family:${font};">
                <p style="margin:0;font-size:15px;line-height:1.6;color:${muted};">
                  Enter this code in Layer to turn on Cloud Sync:
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 44px 0;font-family:${font};">
                <div style="display:inline-block;background:#f6f6f7;border:1px solid ${line};
                  border-radius:12px;padding:18px 28px;font-size:34px;font-weight:700;
                  letter-spacing:10px;color:${ink};font-family:'SFMono-Regular',Consolas,
                  'Liberation Mono',Menlo,monospace;">
                  ${code}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 44px 0;font-family:${font};">
                <p style="margin:0;font-size:14px;line-height:1.6;color:${muted};">
                  This code expires in 10 minutes. If you didn't request it, you
                  can safely ignore this email — nothing will change.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 44px 40px;font-family:${font};">
                <p style="margin:0;font-size:12px;line-height:1.5;color:${faint};">
                  Sent by Layer because someone entered this address to enable
                  Cloud Sync. — made with care by Haris.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

module.exports = { welcomeEmail, otpEmail, storeAnnouncementEmail }
