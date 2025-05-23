import { Middleware } from "@reduxjs/toolkit";
import { setCookie, getCookie, deleteCookie } from "@/lib/cookies";

const AUTH_COOKIE_NAME = "fam8_auth";

export const authPersistenceMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);

    if (action && typeof action === "object" && "type" in action) {
      const actionType = (action as { type: string }).type;

      // Saving auth state after successful sign in
      if (
        actionType === "auth/signInSuccess" ||
        actionType === "auth/signUpSuccess"
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = store.getState() as any;
        if (state.auth.user) {
          const authData = {
            user: {
              id: state.auth.user.id,
              name: state.auth.user.name,
              email: state.auth.user.email,
              roles: state.auth.user.roles,
            },
            token: state.auth.user.token,
          };
          setCookie(AUTH_COOKIE_NAME, JSON.stringify(authData), 7);
        }
      }

      if (actionType === "auth/signOut") {
        deleteCookie(AUTH_COOKIE_NAME);
      }
    }

    return result;
  };

export const loadAuthState = () => {
  try {
    const authData = getCookie(AUTH_COOKIE_NAME);
    if (!authData) {
      return undefined;
    }

    const parsedData = JSON.parse(authData);
    return {
      user: parsedData.user,
      loading: false,
      error: null,
    };
  } catch {
    return undefined;
  }
};
