# Inno'studio Portfolio (React + Vite)

This is the React + Vite version of the portfolio site, converted from the original static HTML/CSS/JS project.

## Development

1) Install dependencies:

	npm install

2) Start the dev server:

	npm run dev

## Notes

- Assets referenced in the UI are expected in public/hub (e.g., Black_Gradient.webm, typing.mp4, work-land.png).
- Update links and copy in the page components inside src/pages.

## Contact Email

The contact form sends email through the Netlify Function in `netlify/functions/contact.mjs`.

Set these environment variables in Netlify under Site configuration > Environment variables:

```bash
RESEND_API_KEY=re_your_api_key_here
CONTACT_FROM_EMAIL=Innostudio <hello@your-verified-domain.com>
```

`CONTACT_FROM_EMAIL` must use a sender/domain verified in Resend. Messages are delivered to `innocentnyalik@gmail.com`.

The public endpoint is `/api/contact`, routed by the function config.
