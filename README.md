<p align="center">
  <img alt="" src="public/icons/icon-72x72.png" width="60" />
</p>

<h1 align="center">Notes</h1>

Contents:

[0. Quick start](#0.)

[1. Development](#1.)

[2. Deployment](#2.)

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

<h1 id="1.">1. Development</h1>

> (NOTE) PWA only works for production mode
>
> (NOTE) Used Redux for state management

<h2>1.0. Start server</h2>

- Option 0: Use docker

  ```bash
  git clone https://github.com/shampooma/notes.git
  cd notes
  ```

  Set `PROCESS_MODE=prod` to `PROCESS_MODE=dev` in `.env`

  ```bash
  ./start.sh build
  ./start.sh up -d
  ```

- Option 1: Start directly

  ```bash
  git clone https://github.com/shampooma/notes.git
  cd notes
  npm ci
  npm run start  
  ```

<h2>1.1. Follow the conventions (My own style)</h2>

<h3>1.1.0. File structure</h3>

```bash
src/
├── components/  // For React component that not rendered as pages
│   ├── Component0.tsx
│   └── Component1/
│       ├── Component1.tsx
│       └── Component2.tsx
├── others/  // For *enum.ts, *slice.ts, *type.ts, \
│   │               and other remaing things
│   ├── Component0_enum.ts
│   ├── Component0_slice.ts
│   ├── Component0_type.ts
│   ├── index_hooks.ts
│   ├── index_store.ts
│   └── Component1/
│       ├── Component1_enum.ts
│       ├── Component1_slice.ts 
│       ├── Component1_type.ts
│       ├── Component2_enum.ts
│       ├── Component2_slice.ts 
│       └── Component2_type.ts
├── images/  // For images
│   └── image0.png
├── pages/  // For pages 
│   ├── 404.tsx
│   └── index.tsx
└── styles/  // For styles
    └── style0.css
```

<h2>1.1.1. Component_slice.ts</h2>

0. Change the slice (e.g. `Component1_slice.ts`)
    ```ts
    import { createSlice, combineReducers } from '@reduxjs/toolkit';
    import { component2Reducer } from "pages/Component1/Component2"; // Import reducers in same directory (Only for the head in the directory)

    export const component1Slice = createSlice({ // Create slice
      name: 'Component1', // Name
      initialState: { // Initial state
        variable1: value1,
      } as {
        variable1: type1,
      },
      reducers: { // Reducers
        setVariable1: (state, action) => {
          state.variable1 = action.payload;
        }
      },
    });

    export default combineReducers({ // Return combined reducers, if not the head of directory, just return a reducer is ok
      component1: component1Slice.reducer,
      component2: combineReducers
    });
    ```

1. Change `index_store.ts`

    ```ts
    import { configureStore } from '@reduxjs/toolkit';
    import component0Reducer from "pages/Component0_slice";
    import component1Reducer from "pages/Component1/Component1_slice"; // Import newly created slice

    export const store = configureStore({ // Add the newly created reducer
      reducer: {
        component0: component0Reducer,
        component1: component1Reducer,
      },
    })

    export type RootState = ReturnType<typeof store.getState>
    export type AppDispatch = typeof store.dispatch
    ```

<h2>1.1.2. Component.tsx</h2>

```tsx
import { useAppSelector, useAppDispatch } from "others/index_hooks"; // Import hooks for redux (global state management)
import { setState0 } from "others/Component0_slice"; // Import actions

const Component1 = ({ // Define parameters and corresponding data type
  variable1, 
}: {
  variable1: type1,
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useAppDispatch();
  const { db, state0 } = useAppSelector((state) => { // Get global state that needed
    return {
      db: state.app.db,
      state0: state.Component0.state0,
    }
  });

  dispatch(setState0("payload")); // Use Global state

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [localState0, setLocalState0] = React.useState(undefined);

  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |
  React.useEffect(() => {}, []);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const function0 = React.useCallback(() => {}, []); // use Callback to reduce computation when re-render

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<></>);
}

export default Component1;
```

<h2>1.1.3. Component_type.ts</h2>

```ts
export interface Interface1 {
  variable1: type1
}
```

<h2>1.1.4. Component_enum.ts</h2>

```ts
export enum Enum1 {
  variable1 = "value1"
}
```

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
