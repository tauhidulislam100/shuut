import { ApolloError, gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import useAsyncEffect from "use-async-effect";
import cookie from "js-cookie";
import { notification } from "antd";
import { useRouter } from "next/router";
import { GET_ME_MUTATION } from "../graphql/query_mutations";

interface IProps {
  children: React.ReactNode;
}

interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  postalCode: boolean;
  phone?: string;
}

export type StateType = {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
  onLogout?: (reload?: boolean) => void;
  handleOAuth?: (
    provider: string,
    incompleteHandler?: (query: URLSearchParams) => void
  ) => void;
  setToken?: (token?: string) => void;
};

const initalState: StateType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: undefined,
};

export const AuthContext = React.createContext(initalState);

const AuthProvider = ({ children }: IProps) => {
  const router = useRouter();
  const [getCurrentUser, { loading }] = useMutation(GET_ME_MUTATION, {
    onCompleted: (data) => onCompleteFetchUser(data),
    onError: (error) => onFetchUserError(error),
  });
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string>();

  useAsyncEffect(
    async (isMouted) => {
      if (!user && isMouted() && cookie.get("token")) {
        await getCurrentUser();
      }
    },
    [user, isAuthenticated, token]
  );

  const onCompleteFetchUser = (data: any) => {
    setUser(data.currentUser);
    setIsAuthenticated(true);
  };

  const onFetchUserError = (error: ApolloError) => {
    notification.error({
      message: error.message,
    });
  };

  const onLogout = (realod = false) => {
    console.log("onLogout: ", cookie.get("token"));
    cookie.remove("token");
    setUser(null);
    setIsAuthenticated(false);
    if (realod) {
      window.location.reload();
    }
  };

  const handleOAuth = (provider: string, callback: any) => {
    if (provider) {
      const authUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/oauth2/login/${provider}?redirect=${window.location.origin}${window.location.pathname}`;
      const win = window.open(
        authUrl,
        "auth",
        "width=600,height=600,scrollbars=yes"
      );
      let waiting = 0;
      const intervalId = setInterval(() => {
        try {
          if (win?.location.href.includes(window.location.host)) {
            console.log("win.location: ", win.location);
            const query = new URLSearchParams(win.location.search);
            if (query.get("status") === "success") {
              cookie.set("token", query.get("token") as string, {
                expires: 1,
              });
              // window.location.href = "/";
              setToken(query.get("token") as string);
              console.log("query: ", query.get("token"));
              router.replace((router.query.redirect as string) ?? "/");
            } else if (query.get("status") === "failed") {
              notification.error({
                message: query.get("message"),
              });
            } else if (query.get("status") === "incomplete") {
              callback?.(query);
            }
            win.close();
            clearInterval(intervalId);
          }
        } catch (error) {
          console.log("error ", error);
        }
        waiting++;
        if (waiting >= 100) {
          win?.close();
          clearInterval(intervalId);
        }
      }, 300);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: loading,
        token,
        setToken,
        onLogout,
        handleOAuth,
      }}
    >
      {loading ? <h2>Loading...</h2> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
