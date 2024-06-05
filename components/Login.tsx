"use client"
import { signIn } from "next-auth/react";
import '../app/globals.css'
export default function Login() {
  return (
    <div>
          <button 
            className="btn btn-lg btn-primary bg-blue-950 text-white rounded-full border-0"
            onClick={() => signIn("keycloak")}
          >
            Sign in with keycloak
          </button>
    </div>
  );
}
