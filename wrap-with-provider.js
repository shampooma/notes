import React from "react"
import { Provider } from "react-redux"

import { createStore } from "components/index/index_store";

const wrapper = ({ element }) => {
  const store = createStore()
  return <Provider store={store}>{element}</Provider>
}

export default wrapper;
