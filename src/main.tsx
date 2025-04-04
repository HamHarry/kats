import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store.ts";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: "Noto Sans Thai",
            },
          }}
        >
          <App />
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
