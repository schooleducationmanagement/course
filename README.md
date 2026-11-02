# Syrantis website

Single-page marketing site for Syrantis ERP. Plain HTML, CSS and JavaScript, no build step.

```
index.html      page markup
css/styles.css  all styles (brand colours are the variables at the top)
js/script.js    menu, live demos, module filter, demo request form
favicon.svg     browser tab icon
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Publish with GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. The site goes live at `https://<your-username>.github.io/<repository-name>/` within a minute or two.

## Connect the demo request form

The form currently shows visitors their request and asks them to email it to syrantis@gmail.com.
To receive requests directly, set `FORM_ENDPOINT` near the top of `js/script.js` to a form
service or API that accepts a JSON `POST` (for example Formspree, Getform, or your own backend):

```js
var FORM_ENDPOINT = 'https://your-form-endpoint';
```

The form sends `name`, `email`, `organisation`, `phone`, `role`, `students` and `message`.
Visitors see a confirmation only when the endpoint replies with a success status; otherwise they get the
copy-and-email step as a fallback.

## Editing contact details

- Email: `CONTACT_EMAIL` at the top of `js/script.js`, plus the address in the "Prefer email?" line and the
  demo-form message in `index.html`.
- Phone numbers and location: the **Contact** column in the footer of `index.html`.
