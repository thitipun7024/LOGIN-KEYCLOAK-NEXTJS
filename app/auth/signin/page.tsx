"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import "@/app/globals.css";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import img from "@/components/image/Animation1.png";
import { signIn } from "next-auth/react";
const drawerWidth = 210;

const signinErrors: Record<string | "default", string> = {
  default: "Unable to sign in.",
  signin: "Try signing in with a different account.",
  oauthsignin: "Try signing in with a different account.",
  oauthcallbackerror: "Try signing in with a different account.",
  oauthcreateaccount: "Try signing in with a different account.",
  emailcreateaccount: "Try signing in with a different account.",
  callback: "Try signing in with a different account.",
  oauthaccountnotlinked:
    "To confirm your identity, sign in with the same account you used originally.",
  sessionrequired: "Please sign in to access this page.",
};

interface SignInPageProp {
  params: object;
  searchParams: {
    callbackUrl: string;
    error: string;
  };
}

export default function Signin({
  searchParams: { callbackUrl, error },
}: SignInPageProp) {
  const { data: session } = useSession();
  if (session) {
    redirect(callbackUrl || "/home");
  } else {
    return(
      redirect("/Login")
    )
  }

}
