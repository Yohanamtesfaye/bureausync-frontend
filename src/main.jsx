import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Auto-restart functionality
// This will reload the page every 24 hours to ensure fresh data and prevent memory leaks
setTimeout(
  () => {
    window.location.reload()
  },
  24 * 60 * 60 * 1000,
)

// Listen for online status to handle recovery after power outage
window.addEventListener("online", () => {
  console.log("Network connection restored. Reloading application...")
  window.location.reload()
})
