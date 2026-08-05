# Sunday School Worksheet Studio

A React + Vite app for building, saving, and reprinting your weekly
"WICM Shining Light" worksheets (0–5 years and 6–12 years), with a
shared library your whole team can browse, filter, and edit.

- **Editor** — fill in theme, verse, songs, coloring image, wordsearch, etc.
- **Library** — every saved worksheet, filterable by age group and date.
- **Preview** — clean read-only view of a saved worksheet, ready to print
  (defaults to A3 landscape).

Data is stored in **Firebase (Firestore)** so the whole team sees the same
shared library, from any device.

---

## 1. Set up Firebase (one-time)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
   and create a free project (the "Spark" free plan is all this app needs).
2. In the project, click **Build → Firestore Database → Create database**.
   Start it in **production mode** (we'll set our own rules next), pick any
   region close to your team.
3. Open the **Rules** tab of Firestore and paste in the contents of
   [`firestore.rules`](./firestore.rules) from this project, then **Publish**.
   Read the security note inside that file before you go further.
4. Click the gear icon → **Project settings → General**, scroll to
   **Your apps**, click the `</>` (web) icon to register a new web app.
   Firebase will show you a config object — you'll need those values in
   the next step.

## 2. Run it locally

Requires [Node.js](https://nodejs.org) 18 or later.

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and paste in your Firebase config values:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Then start the dev server:

```bash
npm run dev
```

Open the printed `localhost` URL in your browser. Changes to the code
hot-reload automatically.

## 3. Deploy so your team can use it

You have two easy options — pick one.

### Option A: Netlify (simplest, since env vars are set in the dashboard)

1. Push this project to a GitHub repo (see below).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build command: `npm run build`  ·  Publish directory: `dist`
4. Under **Site settings → Environment variables**, add all six
   `VITE_FIREBASE_*` variables with your Firebase values.
5. Deploy. Netlify gives you a shareable URL — send that to your team.
6. In `vite.config.js`, change `base: '/worksheet-studio/'` to `base: '/'`
   before deploying to Netlify (Netlify serves from the domain root).

### Option B: GitHub Pages

1. Create a new GitHub repo, e.g. `worksheet-studio`, and push this project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/worksheet-studio.git
   git push -u origin main
   ```
2. In `vite.config.js`, make sure `base` matches your repo name exactly:
   `base: '/worksheet-studio/'` (already set — update if you named the repo differently).
3. Because GitHub Pages serves a static build with no server-side env
   vars, bake your Firebase values in at build time instead:
   ```bash
   VITE_FIREBASE_API_KEY=... \
   VITE_FIREBASE_AUTH_DOMAIN=... \
   VITE_FIREBASE_PROJECT_ID=... \
   VITE_FIREBASE_STORAGE_BUCKET=... \
   VITE_FIREBASE_MESSAGING_SENDER_ID=... \
   VITE_FIREBASE_APP_ID=... \
   npm run build
   ```
4. Deploy the `dist` folder to the `gh-pages` branch:
   ```bash
   npx gh-pages -d dist
   ```
5. In your GitHub repo, go to **Settings → Pages** and set the source to
   the `gh-pages` branch. Your app will be live at
   `https://YOUR-USERNAME.github.io/worksheet-studio/`.

   > Because your Firebase config ends up in the published JavaScript
   > bundle either way, treat the deployed link itself as the access
   > control — don't post it somewhere public. See the security note in
   > `firestore.rules`.

## Project structure

```
src/
  App.jsx                 top-level view routing + editor state
  firebaseClient.js        Firebase/Firestore connection
  components/
    TopNav.jsx
    Editor.jsx             the editable worksheet + toolbar
    Library.jsx             filterable list of saved worksheets
    Preview.jsx             read-only view + print
    WorksheetPage.jsx       shared page layout (editable or read-only)
    WordSearchGrid.jsx      self-sizing wordsearch grid
    Icons.jsx                inline SVG icon set
  data/defaultDoc.js         starter content for a new worksheet
  utils/wordsearch.js        wordsearch generation logic
  utils/mapping.js           fills in defaults for a loaded Firestore doc
firestore.rules              paste into Firebase Console -> Firestore -> Rules
```

## Notes & limitations

- **No login screen.** Anyone with the deployed link (and thus your
  Firebase config) can read, add, edit, and delete worksheets. That's
  fine for a small internal team tool, but don't publish the link
  publicly. Adding Firebase Authentication is a natural next step if you
  outgrow this.
- **Coloring images** are stored as base64 text directly in the Firestore
  document. That's simple and works well for typical worksheet images.
  Firestore documents have a 1 MiB size cap, so very large/high-resolution
  photos could hit that limit — if you run into it, switching to Firebase
  Storage for images is the natural upgrade.
- **Wordsearch puzzles are saved exactly as generated** — reopening a
  saved worksheet always shows the same grid it had when you saved it.
- **Free tier**: Firestore's free (Spark) plan includes 50K document reads
  and 20K writes per day, and 1 GiB of stored data — comfortably enough
  for a weekly church worksheet library.
