import React, { useState, useEffect } from "react";
import { useAuth } from "oidc-react";
import { App } from "./App";
import TodoService from "./todoService";

export function LoginWrapper() {
  const auth = useAuth();
  const { userData } = auth;
  const isAuthenticated = userData?.id_token ? true : false;
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!auth.isLoading && !isAuthenticated) {
      auth.signIn();
    } else {
      setLoggedIn(true);
    }
  }, [auth, isAuthenticated]);

  //Only load the app if the user is logged in, and user data is available
  if (loggedIn && userData?.profile.email) {
    return (
      <TodoService token={userData.id_token}>
        <App
          user={{
            email: userData.profile.email,
            sub: userData.profile.sub,
          }}
        ></App>
      </TodoService>
    );
  } else {
    return null;
  }
}
