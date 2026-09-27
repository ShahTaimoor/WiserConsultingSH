/**
 * Auth cookie options based on the actual request protocol (needs `trust proxy` behind Nginx),
 * so the cookie also works on plain http://localhost even when NODE_ENV=production.
 */
const authCookieOptions = (req) => ({
  httpOnly: true,
  secure: req.secure,
  sameSite: req.secure ? 'None' : 'Lax',
});

module.exports = { authCookieOptions };
