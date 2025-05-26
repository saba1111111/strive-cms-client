import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => (
  <div
    style={{
      width: "180px",
      background: "#f0f0f0",
      height: "100vh",
      padding: "1rem 0.5rem",
      boxSizing: "border-box",
    }}
  >
    <nav>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li>
          <NavLink
            to="/subscribers"
            style={({ isActive }) => ({
              display: "block",
              padding: "0.5rem 0",
              color: isActive ? "#007aff" : "#333",
              textDecoration: "none",
            })}
          >
            Subscribers
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/campaigns"
            style={({ isActive }) => ({
              display: "block",
              padding: "0.5rem 0",
              color: isActive ? "#007aff" : "#333",
              textDecoration: "none",
            })}
          >
            Campaigns
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/llms"
            style={({ isActive }) => ({
              display: "block",
              padding: "0.5rem 0",
              color: isActive ? "#007aff" : "#333",
              textDecoration: "none",
            })}
          >
            LLMS
          </NavLink>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
