import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { LoginWrapper } from "./LoginWrapper";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "oidc-react";

const configuration = {
  authority: `https://${process.env.REACT_APP_OIDC_DOMAIN}/dex`,
  clientId: process.env.REACT_APP_OIDC_CLIENT_ID,
  autoSignIn: true,
  responseType: "id_token",
  scope: "openid profile email",
  redirectUri: window.location.origin,
  audience: process.env.REACT_APP_OIDC_AUDIENCE,
  onSignIn: () => {
    window.location.replace(window.location.origin);
  },
};

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider {...configuration}>
      <LoginWrapper />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
