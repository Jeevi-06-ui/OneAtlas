import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in",
  description: "Sign in to OneAtlas Runtime Builder",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center">Loading</div>}>
      <LoginForm />
    </Suspense>
  );
}
