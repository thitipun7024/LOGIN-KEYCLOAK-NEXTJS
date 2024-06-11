"use client";
import federatedLogout from "@/utils/federatedLogout";
import "../app/globals.css";
export default function Logout() {
  return (
    <div>
      <button 
        onClick={() => federatedLogout()}
        className="btn btn-error"
      >
        ยืนยัน
      </button>
    </div>
  );
}
