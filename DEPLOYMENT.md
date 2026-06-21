# Deployment Guide

This project is a static website. You can deploy it to shared hosting, GitHub Pages, Netlify, Vercel, or a similar static host.

## Before Uploading

1. Update the admin credentials in `login.html`.
   The current username and password are hardcoded in frontend code, so you should change them before publishing.

2. Configure the contact form in `index.html`.
   Replace:
   `https://formspree.io/f/YOUR_FORM_ID`
   with your real Formspree endpoint if you want direct hosted submissions.

3. Configure global construction mode in `site-config.js` if you want site-wide lock mode.
   Fill in:

   ```js
   window.JF_SITE_CONFIG = {
     jsonBinId: '6a36da9bda38895dfee3d710',
     jsonBinReadKey: '$2a$10$D2qJ4PLoQQxOmtQAaC/l8ukd/se88HZ4FCnl4c.dLxWiEhBKaJxqW'
   };
   ```

4. Keep your JSONBin bin private.
   Use a read-only access key in `site-config.js`.
   Do not place your JSONBin master key in any public file.

## Upload

Upload these files and folders to your host:

- `index.html`
- `404.html`
- `admin.html`
- `login.html`
- `thank-you.html`
- `style.css`
- `script.js`
- `site-config.js`
- `robots.txt`
- `sitemap.xml`
- `images/`

## After Uploading

1. Enable SSL/HTTPS in your hosting panel.
2. Force HTTPS so the site does not load over plain HTTP.
3. Open `login.html`.
4. Go to the Site Mode section in admin.
5. Paste your JSONBin master key there and click `Save & Connect`.
   The master key is stored only in that browser for admin updates.

## Construction Mode Setup Summary

- Public website reads:
  - `jsonBinId`
  - `jsonBinReadKey`
- Admin writes:
  - JSONBin master key entered in the admin panel

This lets construction mode work globally for all visitors while keeping the write key out of public files.

## Important Security Note

The admin system is still frontend-only.
That means it is convenient, but not truly secure for a public production admin panel.

If you need real security, use one of these:

- host-level password protection
- a backend login system
- a CMS or server-side admin
