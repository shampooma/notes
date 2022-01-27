<p align="center">
  <img alt="" src="./src/images/icon.png" width="60" />
</p>

<h1 align="center">Notes</h1>

Contents:

<span>0. Quick start</span>

[1. Development](./readme/development.md)

[2. Deployment](./readme/deployment.md)

---

<h1 id="0.">0. Quick start</h1>

<h2>0.0. Get the website ready</h2>

- Option 0: visit GitHub page

  <a href=https://shampooma.github.io/notes/>https://shampooma.github.io/notes/</a>

- Option 1: Host the website by docker

  ```bash
  git clone https://github.com/shampooma/notes.git
  cd notes
  ./start.sh build
  ./start.sh up -d
  ```

  visit: <a href=http://localhost:9000>http://localhost:9000</a>

- Option 2: Host the website directly

  ```bash
  git clone https://github.com/shampooma/notes.git
  cd notes
  npm ci --production
  npm run build
  npm run serve
  ```

  visit: <a href=http://localhost:9000>http://localhost:9000</a>

<h2>0.1. Install on mobile phone</h2>

Find a way for `Add to home screen`
