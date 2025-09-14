"use client";
import React, { createContext, useState } from "react";
import { Header } from "./_components/Header";

const WebCamContext = createContext(); // no export

export default function DashboardLayout({ children }) {
  const [data, setData] = useState(null);

  return (
    <WebCamContext.Provider value={{ data, setData }}>
      <Header />
      <div className="mx-5 md:mx-20 lg:mx-36">{children}</div>
    </WebCamContext.Provider>
  );
}
