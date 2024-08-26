"use client";
import federatedLogout from "@/utils/federatedLogout";
import "../app/globals.css";
export default function Logout({onClick}) {
  return (
    <div>
      <button 
        onClick={() => {
          onClick();
          federatedLogout(); 
        }}
        className="btn btn-error text-white"
      >
        ยืนยัน
      </button>
    </div>
  );
}
