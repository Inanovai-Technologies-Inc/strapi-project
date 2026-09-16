# Deploying to Railway

This monorepo has **two apps** plus **one database**, so the Railway project
has **three services**:

| Service        | Source path      | What it is            |
| -------------- | ---------------- | --------------------- |
| `postgres`     | Railway plugin   | Database for Strapi   |
| `strapi`       | `sample-project` | Strapi 5 CMS + admin  |
| `frontend`     | `frontend`       | Next.js 16 website    |

`railway.json` + `.nvmrc` (Node 22) are committed in each app folder, so Railway
uses Nixpacks with `npm run build` / `npm run start` automatically. You only need
to set the **root directory** and **environment variables** per service.

---

## 1. Create the project & database

1. Railway dashboard → **New Project** → **Deploy from GitHub repo** →
   `Inanovai-Technologies-Inc/strapi-project` (branch `main`).
2. When it asks what to deploy, you can let it add one service; we'll fix its
   settings below and add the rest.
3. **New** → **Database** → **Add PostgreSQL**. Leave it as-is; it exposes
   `DATABASE_URL` and `DATABASE_PUBLIC_URL` reference variables.

---

## 2. `strapi` service

**Settings → Source**
- Root Directory: `sample-project`
- Watch Paths (optional): `sample-project/**`

**Settings → Networking**
- **Generate Domain** (port `1337`). Copy the URL, e.g.
  `https://strapi-production-xxxx.up.railway.app` — you need it for the frontend.

**Variables** (paste in the "Raw Editor"):

```
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=false

HOST=0.0.0.0
PORT=1337

APP_KEYS=g+/Bz5wupITzeVX3xqwRkorWi8vHsltvEYsdLygerQA=,qo3oZpAL91+fINjTwmi02OrR5kc2AxyuErTayudoeN0=,xg66SIBwbQU1yCxRRE9AJ5BYVU2e2zkF50YraO/P+fM=,sVTvREY+kCtZJWW3dpe+/lFroWqUYgYIIbwdwA0qKEk=
API_TOKEN_SALT=VwuhGw+24r8X5DasQs6NimkM+tw659WaA+gplz+5YnA=
ADMIN_JWT_SECRET=IWE2rL9u+/r4702KISyGPUT3uZq5VKhFYthUJewTK8M=
TRANSFER_TOKEN_SALT=Ws3D11RubWOzLhDT48YEK6TGwDPqnBaVLf245vRU6wk=
JWT_SECRET=BUuZDbKw6WufT1igNwqklt90TcEfpIH3JqPptXiYuNE=
ENCRYPTION_KEY=G/HzYWGUqcvOeUnBkRu8zlnD16BiFM5oWcL+n8IgGew=
```

> These secrets were generated fresh for this deploy. Treat them as production
> secrets — don't commit them, don't reuse the local `sample-project/.env`
> values. To regenerate any of them: `openssl rand -base64 32`.
> `${{Postgres.DATABASE_URL}}` is a Railway *reference* — if your DB service is
> named something other than `Postgres`, adjust the prefix.

**Persistent uploads (Volume)**
Strapi writes uploaded media to `public/uploads`, and Railway's container
filesystem is wiped on every redeploy. Add a volume:

- Service → **Settings → Volumes → New Volume**
- Mount path: `/app/public/uploads`

Note: the volume starts empty and shadows the image files currently committed in
the repo, so existing content will show broken images until you re-upload it
through the admin. Since the database also starts empty (see step 4) you'll be
re-entering content anyway. Longer term, switch to a Cloudinary/S3 upload
provider so media isn't tied to one volume.

---

## 3. `frontend` service

**New → GitHub Repo → same repo**, then:

**Settings → Source**
- Root Directory: `frontend`

**Settings → Networking**
- **Generate Domain** (port `3000`) — this is your public site URL.

**Variables:**

```
NODE_ENV=production
STRAPI_URL=https://<your-strapi-domain>
NEXT_PUBLIC_STRAPI_URL=https://<your-strapi-domain>
GEMINI_API_KEY=<your Google Gemini API key>
```

Replace `<your-strapi-domain>` with the URL from step 2 (no trailing slash).
`NEXT_PUBLIC_STRAPI_URL` is baked in at **build time**, so it must be set before
the build runs — set the vars, then trigger a redeploy.

`GEMINI_API_KEY` powers the chat route at `app/api/chat/route.ts`
(get one from https://aistudio.google.com/apikey). The site builds and runs
without it, but the chatbot returns a 500.

---

## 4. First boot of Strapi

1. Wait for the `strapi` deploy to go green. On first start it auto-creates all
   tables in Postgres.
2. Open `https://<your-strapi-domain>/admin` and create the first admin user.
3. **Settings → Users & Permissions → Roles → Public** and enable the read
   endpoints the site needs (`product`, `new`, `career`, `office`,
   `site-setting`, `technical-document` → `find`/`findOne`; `contact` and
   `carrer-application` → `create`).

   Or do it in one shot from the repo — Railway service **Settings → Deploy →
   Custom Start Command** temporarily, or run locally against the prod DB:
   ```
   node ./scripts/set-public-permissions.js
   ```
   (`sample-project/scripts/set-public-permissions.js`, included in this branch.)
4. Re-add content and re-upload media/images.

---

## 5. Deploy order / gotchas

- Deploy **postgres → strapi → frontend**, because the frontend build needs the
  Strapi domain.
- If the Strapi build runs out of memory, add `NODE_OPTIONS=--max-old-space-size=2048`
  to the `strapi` service and/or bump the plan.
- CORS: Strapi 5's default allows all origins, so the frontend can call it as-is.
  To lock it down later, configure `config/middlewares.js` `strapi::cors` with
  `origin: ['https://<your-frontend-domain>']`.
- Every push to `main` auto-redeploys both services. Use "Watch Paths" so a
  frontend-only change doesn't rebuild Strapi and vice versa.
