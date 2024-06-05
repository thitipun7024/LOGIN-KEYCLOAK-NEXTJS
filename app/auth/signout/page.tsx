"use client";
//import Logout from "@/components/Logout";
import { useSession } from "next-auth/react";

import { redirect } from "next/navigation";

export default  function SignoutPage() {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <div></div>
    )
  }
  return redirect("/api/auth/signin")
}