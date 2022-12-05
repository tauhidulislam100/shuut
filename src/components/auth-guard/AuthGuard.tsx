import React, { useEffect, useState } from "react";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { parseJwt } from "../../utils/utils";
import { useAuth } from "../../hooks/useAuth";
import { Spin } from "antd";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, onLogout } = useAuth();

  useEffect(() => {
    if (!cookie.get("token") && !isLoading && !isAuthenticated) {
      onLogout?.(false);
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, onLogout]);

  if (!isLoading && isAuthenticated) return <>{children}</>;

  return (
    <div className="fixed w-screen h-screen flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
};

export default AuthGuard;
