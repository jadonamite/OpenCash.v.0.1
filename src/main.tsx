import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import PrivyConfig from "./PrivyConfig";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BrowserRouter>
         <PrivyConfig>
            <App />
         </PrivyConfig>
      </BrowserRouter>
   </StrictMode>
);
