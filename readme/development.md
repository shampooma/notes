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

[1.0. Procedures](#1.0.)

[1.1. File structure](#1.1.)

[1.2. State management](#1.2.)

[1.3. Pages && Components](#1.3.)

[1.4. IndexedDB](#1.4.)

[1.5. Convensions](1.5.)

[1.6. Bugs](#1.6.)

<h2 id="1.0.">1.0. Procedures</h2>

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

<h2 id="1.1.">1.1. File structure</h2>

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

<h2 id="1.2.">1.2. State management</h2>

<h3>1.2.0. Tech</h3>

0. Redux

<h3>1.2.1. Global state</h3>

How to use refer to *_slice.ts

0. Change the slice
    ```ts
    import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
    import { component2Reducer } from "components/Component1/Component2"; // Import reducers in same directory 

    export const component1Slice = createSlice({ // Slice copntains reducers and actions
      name: 'Component1',
      initialState: {
        state1: value1, // State how to use
      } as {
        state1: type1,
      },
      reducers: {
        setState1: (state, action: PayloadAction<type1>) => {
          state.state1 = action.payload;
        }
      },
    });

    export const component1Reducer = combineReducers({
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

<h2 id="1.3.">1.3. Pages && Components</h2>

```tsx
import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { setState0 } from "others/Component0_slice"; // Import redux actions

const Component1 = ({ // Define parameters and corresponding data type
  variable1,
}: {
  variable1: type1,
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { db, state0 } = useIndexSelector((state) => { // Get global state that needed
    return {
      db: state.index.db,
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
  React.useEffect(() => {
    (async () => {
      await new Promise((res, rej) => {})
    })();
  }, []);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const function0 = React.useCallback(async () => {
    try {
    } catch (e) {
    } finally {
    }
  }, []); // use Callback to reduce computation when re-render

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<></>);
}

export default Component1;
```

<h2 id="1.4.">1.4. IndexedDB</h2>

<h3>1.4.0 Config</h4>

DB configs are stored in `src/indexeddb/config.ts`

<h3>1.4.1 Using APIs</h3>



```ts
import { DBStoreNameV2} from "indexeddb/type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { LoadingString } from 'components/Loading/Loading_type';

dispatch(pushLoading(LoadingString.loading_enum));

try {s
  const items = await new Promise((res, rej) => {
    const request = db.transaction(DBStoreNameV2.stockRecordStore, "readonly").objectStore(DBStoreNameV2.stockRecordStore).getAll();
  
    request.onerror = (e) => {
      console.log(e);
      rej(e);
    }
  
    request.onsuccess = () => {
      res(request.result);
    }
  });
} catch (e) {
  console.log(e);
} finally {
  dispatch(deleteLoading(LoadingString.loading_enum))
}
```

<h2 id="1.5.">1.5. Convensions</h2>

<h3>1.5.0. Naming</h3>

If the variable not only used in certain area, it should contain prefix that indicate what this variable used for, such as `DBUpgrade`

<h3>1.5.1. Error handling</h3>

Error should handled within same file 

```ts
const fun = () => {
  try {

  } catch (e) {
    console.log(e);
  }
}
```

<h2 id="1.6.">1.6. Bugs</h2>

<h3>Bug 0</h3>

<h4>Problem</h4>

When using docker for development, donsole continue output `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:xxxxx/socket.io/?EIO=4&transport=polling&t=XXXXXX. (Reason: CORS request did not succeed). Status code: (null).`

<h4>Solution</h4>

Add environment variable `INTERNAL_STATUS_PORT`, and map the port

<h3>Bug 1</h3>

<h4>Problem</h4>

Redux not recommended to put non-serializable values in state or actions.

<h4>Solution</h4>

Ignore it by setting `ignoredActions` and `ignoredPaths` in `index_store.ts`
