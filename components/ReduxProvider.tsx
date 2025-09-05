"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { fetchSettings } from "@/lib/redux/settingsSlice";

// Component to handle initial settings fetch
function SettingsInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dispatch the settings fetch when the app loads
    store.dispatch(fetchSettings());
  }, []);

  return <>{children}</>;
}

// Main Redux Provider component
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <SettingsInitializer>{children}</SettingsInitializer>
    </Provider>
  );
}
