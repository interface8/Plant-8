"use client";

import type React from "react";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { checkAuthThunk } from "@/store/sign-in/effects/auth.thunk";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthThunk());
  }, [dispatch]);

  return <>{children}</>;
}
