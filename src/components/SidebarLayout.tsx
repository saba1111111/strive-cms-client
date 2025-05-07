import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const SidebarLayout: React.FC = () => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
  </div>
);

export default SidebarLayout;
