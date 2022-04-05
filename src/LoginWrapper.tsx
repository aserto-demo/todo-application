import React, { useState, useEffect } from "react";
import { useAuth } from "oidc-react";
import { App } from "./App";
import { initializeService } from "./service";
export function LoginWrapper() {
  const auth = useAuth();
  const isAuthenticated = auth.userData?.id_token ? true : false;
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!auth.isLoading && !isAuthenticated) {
      auth.signIn();
    } else {
      setLoggedIn(true);
    }
  }, [auth, isAuthenticated]);

  const { userData } = auth;
  //Only load the app if the user is logged in, and user data is available
  if (loggedIn && userData && userData.profile.email) {
    const service = initializeService(userData.id_token);
    return (
      <App
        service={service}
        user={{
          id_token: userData.id_token,
          profile: {
            email: userData.profile.email,
            sub: userData.profile.sub,
          },
        }}
      ></App>
    );
  } else {
    return null;
  }
}
