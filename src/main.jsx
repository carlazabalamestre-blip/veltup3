import React from "react";
import { createRoot } from "react-dom/client";
import AppGuided from "./AppGuided.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppGuided />
  </React.StrictMode>
);
