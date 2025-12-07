# Hubcredo Auth Demo

This mini project demonstrates a browser-based authentication flow that talks to two Hubcredo webhooks:

- `https://soubam.app.n8n.cloud/webhook/hubcredo_signup`
- `https://soubam.app.n8n.cloud/webhook/hubcredo_login`

The UI is intentionally simple: a landing page (`index.html`) that links to standalone sign-up and login pages. Each form runs entirely on the client and decides whether to send users to `success.html` or `unsuccessful.html` based on the webhook response (`return` equals `1` or `0`).

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Entry page with CTA buttons for sign up / login |
| `signup.html` | Dedicated registration form that hashes the password before calling the signup webhook |
| `login.html` | Dedicated login form with hashing + redirect logic |
| `auth-utils.js` | Shared helper that computes a SHA-256 password hash using the Web Crypto API |
| `success.html` | Success confirmation screen |
| `unsuccessful.html` | Failure screen with a retry link |

## Running Locally

1. Serve the folder with any static web server (or open the HTML files directly in a browser). Examples:
   - macOS: `python3 -m http.server 8000`
   - Node: `npx serve .`
2. Visit `http://localhost:8000/index.html`.
3. Choose **Create a new account** or **Log into Hubcredo**.
4. Fill out the form. Password fields are plain text inputs, but the value is hashed in the browser before being sent over the network.
5. After the webhook responds, the page redirects to `success.html` if `return` equals `1`, otherwise `unsuccessful.html`.

> **Note:** The webhooks expect GET requests with query parameters; make sure the backend is reachable from your browser.

## Implementation Notes

- **Password hashing:** `auth-utils.js` exposes a global `hashPassword` function that both sign-up and login scripts call before assembling the request payload. This keeps the plaintext secret out of network traffic and guarantees both forms use the exact same algorithm.
- **Response handling:** Each form takes the raw webhook body, attempts to parse JSON, and falls back to the plain string. The shared `getReturnValue` helper checks for a `return` property or a top-level `"1"`/`"0"` string to determine success.
- **Error handling:** Network failures or malformed responses send users to `unsuccessful.html`. Buttons are disabled while the request runs to avoid duplicate submissions.

## Customization Tips

- Update the webhook URLs in `signup.html` and `login.html` if your endpoints move.
- Adjust the success/unsuccessful content to fit your brand voice.
- If you need stronger client-side validation (e.g., password requirements), add it before calling `hashPassword`.
