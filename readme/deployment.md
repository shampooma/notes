<p align="center">
  <img alt="" src="../src/images/icon.png" width="60" />
</p>

<h1 align="center">Notes</h1>

[0. Quick start](../README.md)

[1. Development](./development.md)

<span>2. Deployment</span>

---

<h1 id="2.">2. Deployment</h1>

<h2>2.0. Procedures</h2>

<h3>2.0.0. Get the site ready</h3>

- Option 0: use docker

  ```sh
  sed -i 's/PROCESS_MODE=.*/PROCESS_MODE=prod/' .env
  ./start.sh build
  if [ ! -e ./docs ]; then mkdir ./docs; elif [ -e ./docs/* ]; then rm -r ./docs/*; fi
  docker cp notes_prod_container:/app/public/. ./docs/
  docker kill notes_prod_container
  ```

- Option 1: use npm directly

  ```sh
  npm run build --prefix-paths
  if [ ! -e ./docs ]; then mkdir ./docs; elif [ -e ./docs/* ]; then rm -r ./docs/*; fi
  cp -r ./public/* ./docs/
  ```

<h3>2.0.1. Push to GitHub</h3>

```sh
git pull origin dev
git add .
git commit -m "new commit"
git push origin dev
```

<h3>2.0.2. Create pull request</h3>

<h2>2.1. Hints</h2>
<h3>2.1.0. Path prefix</h3>

When push to GitHub the website is in the path /notes, navigation in the app could achieved by:
- Setting `pathPrefix: '/notes'` in `gatsby-config.js`, 
- Use `--prefix-paths` for `build` and `serve`

<h3>2.1.1. GitHub page building source</h3>

GitHub page is built from the `/docs` folder in the `main` branch
