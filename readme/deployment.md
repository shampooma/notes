<p align="center">
  <img alt="" src="../src/images/icon.png" width="60" />
</p>

<h1 align="center">Notes</h1>

Contents:

[0. Quick start](../README.md)

[1. Development](./development.md)

<span>2. Deployment</span>

---

<h1 id="2.">2. Deployment</h1>

<h2>2.0. Get static site contents ready</h2>

- Option 0: use docker

  Set `PROCESS_MODE=prod` in `.env`

  ```bash
  ./start.sh build
  ./start.sh up -d
  mkdir docs
  docker cp notes_prod_1:/app/public/. ./docs/
  ```

- Option 1: use npm directly

  ```bash
  mkdir docs
  npm run build
  cp -r ./public/* ./build/*
  ```

<h2>2.1. Push to GitHub</h2>

```bash
git push origin main
```
