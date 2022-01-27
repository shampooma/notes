<p align="center">
  <img alt="" src="../src/images/icon.png" width="60" />
</p>

<h1 align="center">Notes</h1>

[0. Quick start](../README.md)

[1. Development](./development.md)

<span>2. Deployment</span>

---

<h1 id="2.">2. Deployment</h1>

<h2>2.0. Get static site contents ready</h2>

- Option 0: use docker

  Set `PROCESS_MODE=prod` in `.env`

  ```sh
  ./start.sh build
  docker run -itd --rm --name notes_prod_container notes_prod sh
  docker cp notes_prod_container:/app/public/. ./docs/
  docker kill notes_prod_container
  ```

- Option 1: use npm directly

  ```sh
  npm run build --prefix-paths
  mkdir docs
  cp -r ./public/* ./docs/
  ```

<h2>2.1. Push to GitHub</h2>

```sh
git add .
git commit -m "new commit"
git push origin dev
```
