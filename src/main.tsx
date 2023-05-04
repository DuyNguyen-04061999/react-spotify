import React from "react";
import ReactDOM from "react-dom/client";
import "@/assets/index.scss";
import App from "./App";
import TranslateProvider from "./components/TranslateProvider";
import { translate } from "./config";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TranslateProvider translate={translate} defaultLang={"eng"}>
      <App />
    </TranslateProvider>
  </React.StrictMode>
);
