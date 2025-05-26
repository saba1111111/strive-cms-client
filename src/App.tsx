import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SidebarLayout from "./components/SidebarLayout";
import SubscribersPage from "./pages/Subscribers";
import CampaignsPage from "./pages/Campaigns";
import AskModelsPage from "./pages/Llms";

// placeholder home page
const Home: React.FC = () => <div>Welcome, you’re logged in!</div>;

const App: React.FC = () => (
  <Routes>
    <Route element={<PublicRoute redirectTo="/subscribers" />}>
      <Route path="/login" element={<Login />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<SidebarLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/subscribers" element={<SubscribersPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/llms" element={<AskModelsPage />} />
      </Route>
      {/* add more protected routes here */}
    </Route>

    <Route path="*" element={<Navigate to="/subscribers" replace />} />
  </Routes>
);

export default App;
