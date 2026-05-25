"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    void fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      router.replace("/login");
      router.refresh();
    });
  }, [router]);

  return (
    <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
      Signing you out…
    </div>
  );
}
