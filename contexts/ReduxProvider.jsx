"use client";
import AppLoader from "@/components/loaders/AppLoader";
import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";
// import { useEffect } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistor = typeof window !== null ? persistStore(store) : null;

const ReduxProvider = ({ children }) => {
  // useEffect(() => {
  //   // document.body.style.zoom = "75%";
  //   // document.body.style.height = "100vh";
  // }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={<AppLoader />} persistor={persistor}>
        {/* <SessionProvider> */}
        <div className="">{children}</div>
        {/* </SessionProvider> */}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
