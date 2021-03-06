<p align="center">
  <img alt="" src="../src/images/formal_note.png" width="60" />
</p>

<h1 align="center">Notes</h1>

[Quick start](../README.md)

<span>Development</span>

[Deployment](./deployment.md)

---

<h1>Development</h1>

> (NOTE) Should use dev branch
>
> (NOTE) PWA only works for production mode

[0. Procedures](#1.0.)

[1. File structure](#1.1.)

[2. State management](#2.)

[3. Pages && Components](#3.)

[4. Database](#4.)

[5. Bugs](#5.)

<h2 id="0.">0. Procedures</h2>

<h3>0.0. Clone git repository</h3>

```sh
git clone -b dev https://github.com/shampooma/notes.git
cd notes
```

<h3>0.1. Start server</h3>

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

<h2 id="1.">1. File structure</h2>

```bash
src/
├── components/  // For React component that not rendered as pages
│   ├── index_hooks.ts
│   ├── index_slice.ts
│   ├── index_store.ts
│   ├── Component0_slice.ts
│   ├── Component0.tsx
│   └── Component1/
│       ├── Component1_slice.tsx
│       ├── Component1.tsx
│       ├── Component2_slice.tsx
│       └── Component2.tsx
├── images/  // For images
│   └── image0.png
└── pages/  // For pages
    ├── 404.tsx
    └── index.tsx
```

<h2 id="2.">2. State management</h2>

<h3>2.0. Tech</h3>

0. Redux

<h3>2.1. Global state</h3>

How to use refer to *_slice.ts

0. Change the slice
    ```ts
    import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
    import { Component2Reducer } from "components/Component1/Component2"; // Import reducers in same directory

    export const Component1Slice = createSlice({ // Slice copntains reducers and actions
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

    export const { setState1 } = Component1Slice.actions;

    export const Component1Reducer = combineReducers({
      Component1: Component1Slice.reducer,
      Component2: CombineReducers
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

<h2 id="3.">3. Pages && Components</h2>

Big text generated from [https://www.fancytextpro.com/BigTextGenerator/Cybermedium](https://www.fancytextpro.com/BigTextGenerator/Cybermedium) using `Cybermedium Text Generator`

```tsx
import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db } from "database/db";
import { useLiveQuery } from "dexie-react-hooks";
import { setState0 } from "others/Component0_slice"; // Import redux actions
import { LoadingString } from "components/Loading/Loading_type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";

const Component1 = ({ // Define parameters and corresponding data type
  variable1,
}: {
  variable1: type1,
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { state0 } = useIndexSelector((state) => { // Get global state that needed
    return {
      state0: state.Component0.state0,
    }
  });

  dispatch(setState0("payload")); // Use Global state

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [localState0, setLocalState0] = React.useState(undefined);

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  React.useEffect(() => {
    (async () => {
      await new Promise((res, rej) => {})
    })();
  }, []);

  useLiveQuery<type>(
    () => db.store.get(0),
    []
  );

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const function0 = React.useCallback(async () => {
    try {
    } catch (e) {
      console.log(e)
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

<h2 id="4.">4. Database</h2>

<h3>4.0. Tech</h4>

Using Dexie

<h3>4.1. Usage</h3>

1. Add a entry to `LoadingString` in `components/Loading/Loading_type`

2. ```ts
   import { LoadingString } from "components/Loading/Loading_type";
   import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
   import { useIndexDispatch } from "components/index/index_hooks";
   import { db } from "database/db";

   const dispatch = useIndexDispatch();

   try {
    dispatch(pushLoading(LoadingString.string))
    await db.store.get(0);

    // Success stackbar
    dispatch(pushNotificationArray({ message: "Success", variant: "success"}))
   } catch (e) {
     console.log(e);

     // Error stackbar
     dispatch(pushNotificationArray({ message: "Failed", variant: "error"}))
   } finally {
     dispatch(deleteLoading(LoadingString.string))
   }

   ```

<h2 id="5.">5. Bugs</h2>

<h3>Bug 0</h3>

<h4>Problem</h4>

When using docker for development, donsole continue output `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:xxxxx/socket.io/?EIO=4&transport=polling&t=XXXXXX. (Reason: CORS request did not succeed). Status code: (null).`

<h4>Solution</h4>

Add environment variable `INTERNAL_STATUS_PORT`, and map the port
