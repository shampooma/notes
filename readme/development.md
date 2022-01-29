<p align="center">
  <img alt="" src="../src/images/icon.png" width="60" />
</p>

<h1 align="center">Notes</h1>

[0. Quick start](../README.md)

<span>1. Development</span>

[2. Deployment](./deployment.md)

---

<h1 id="1.">1. Development</h1>

> (NOTE) Should use dev branch
>
> (NOTE) PWA only works for production mode

<h2>1.0. Procedures</h2>

<h3>1.0.0. Clone git repository</h3>

```sh
git clone -b dev https://github.com/shampooma/notes.git
cd notes
```

<h3 id="1.1.1.">1.0.1. Start server</h3>

- Option 0: Use docker

  ```sh
  sed -i 's/PROCESS_MODE=.*/PROCESS_MODE=dev/' .env
  ./start.sh build
  ./start.sh up -d
  ```

- Option 1: Use npm directly

  ```sh
  npm ci
  npm run start
  ```

<h2>1.1. Hints</h2>

<h3>1.1.0. File structure</h3>

```bash
src/
├── components/  // For React component that not rendered as pages
│   ├── Component0.tsx
│   └── Component1/
│       ├── Component1.tsx
│       └── Component2.tsx
├── images/  // For images
│   └── image0.png
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
├── pages/  // For pages
│   ├── 404.tsx
│   └── index.tsx
└── styles/  // For styles
    └── style0.css
```

<h3>1.1.1. State management</h3>

Using `Redux` for global state management, local state could define in component with `React.useState`

Following is example of changing Component1_slice

0. Change the slice
    ```ts
    import { createSlice, combineReducers } from '@reduxjs/toolkit';
    import { component2Reducer } from "pages/Component1/Component2"; // Import reducers in same directory (Only for the head in the directory)

    export const component1Slice = createSlice({ // Slice copntains reducers and actions
      name: 'Component1',
      initialState: {
        state1: value1,
      } as {
        state1: type1,
      },
      reducers: {
        setState1: (state, action) => {
          state.state1 = action.payload;
        }
      },
    });

    export const { // Return actions
      setState1,
    } = component1Slice.actions

    export const component1Reducer = combineReducers({ // Return combined reducers, if not the head of directory, just return a reducer is ok
      component1: component1Slice.reducer,
      component2: combineReducers
    });
    ```

1. Change `index_store.ts`

    ```ts
    import { configureStore } from '@reduxjs/toolkit';
    import { component0Reducer } from "pages/Component0_slice";
    import { component1Reducer } from "pages/Component1/Component1_slice"; // Import newly created slice

    export const store = configureStore({ // Add the newly created reducer
      reducer: {
        component0: component0Reducer,
        component1: component1Reducer,
      },
    })

    export type RootState = ReturnType<typeof store.getState>
    export type AppDispatch = typeof store.dispatch
    ```

<h3>1.1.2. Pages && Components</h3>

```tsx
import { useAppSelector, useAppDispatch } from "others/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { setState0 } from "others/Component0_slice"; // Import redux actions

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

<h3>1.1.3. Bugs</h3>

<h4>Bug 0</h4>

<h5>Problem</h5>

When using docker for development, donsole continue output `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:xxxxx/socket.io/?EIO=4&transport=polling&t=XXXXXX. (Reason: CORS request did not succeed). Status code: (null).`

<h5>Solution</h5>

Add environment variable `INTERNAL_STATUS_PORT`, and map the port

<h4>Bug 1</h4>

<h5>Problem</h5>

Redux not recommended to put non-serializable values in state or actions.

<h5>Solution</h5>

Ignore it by setting `ignoredActions` and `ignoredPaths` in `index_store.ts`
