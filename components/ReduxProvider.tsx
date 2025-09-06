"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";

// Main Redux Provider component
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
