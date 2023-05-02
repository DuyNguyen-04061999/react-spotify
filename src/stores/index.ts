import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
// import rootSaga from "./rootSaga";

const reducer = {};
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: false, //tắt lỗi a non-serialize
    }).concat(sagaMiddleware),

  devTools: import.meta.env.VITE_ENV === "development",
});

// sagaMiddleware.run(rootSaga);

export default store;
