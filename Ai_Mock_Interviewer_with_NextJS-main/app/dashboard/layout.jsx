"use client";
import React, { createContext, useState } from "react";
import { Header } from "./_components/Header";

// 1. Create Context
export const WebCamContext = createContext({
  webCamEnabled: false,
  setWebCamEnabled: () => {},
});

function DashboardLayout({ children }) {
  // 2. State for webcam
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  return (
    <WebCamContext.Provider value={{ webCamEnabled, setWebCamEnabled }}>
      <Header />
      <div className="mx-5 md:mx-20 lg:mx-36">{children}</div>
    </WebCamContext.Provider>
  );
}

export default DashboardLayout;
