"use client"
import { signIn } from "next-auth/react";
import '../app/globals.css'
export default function Login() {
  return (
    <div>
          <button 
            className="btn btn-lg btn-primary bg-blue-950 text-white rounded-full border-0 w-44"
            onClick={() => signIn("keycloak")}
          >
            เข้าสู่ระบบ
          </button>
    </div>
  );
}
