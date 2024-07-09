"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";

export default function page() {

  return (
    <div className="background2">
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="absolute top-0 left-0 right-0 lg:h-56 md:h-48 sm:h-48 h-44 bg-blue-950 transform rounded-b-3xl">
            <a className="btn btn-ghost mt-5 ml-3 text-white" href="/home">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-chevron-double-left"
                viewBox="0 0 16 16"
              >
                <path d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                <path d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708z" />
              </svg>
            </a>
            <div className="flex flex-col justify-center items-center mt-1">
              <img
                src="https://minio.saksiam.co.th/public/saktech/logo/LogoParcel.png"
                className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 lg:-mt-20 md:-mt-16 sm:-mt-16 -mt-16"
              />
              <div className="card bg-clip-border lg:w-2/5 md:w-3/5 w-11/12 p-1 bg-base-100 shadow-xl flex flex-row items-center justify-center h-20">
                <h2 className="text-4xl font-bold">ชื่อสินทรัพย์</h2>
              </div>
              
              <div className="mt-8"></div>

              <div className="container contents">
                <div className="container flex items-center justify-center mb-2">
                <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                  <div className=' card-body'>
                    <h2 className='text-center text-xl -mt-5'>รายละเอียด</h2>

                    <div className='grid lg:gap-x-20 md:gap-x-20 sm:gap-x-20 gap-x-3 gap-y-10 lg:grid-cols-2 md:grid-cols-2 grid-cols-2 justify-center mt-5'>
                      <div className="flex flex-col items-center">
                        <h2>Asset</h2>
                        111
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <h2>ชื่อสินทรัพย์</h2>
                        111
                      </div>

                      <div className="flex flex-col items-center">
                        <h2>ประเภทพัสดุ</h2>
                        111
                      </div>

                      <div className="flex flex-col items-center">
                        <h2>สังกัด</h2>
                        111
                      </div>

                      <div className="flex flex-col items-center">
                        <h2>สถานะ</h2>
                        <select className="select select-bordered select-sm w-32 max-w-xs text-black">
                          <option selected >รอตรวจนับ</option>
                          <option value={1}>ปกติ</option>
                          <option value={2}>โยกย้าย</option>
                          <option value={3}>อื่นๆ</option>
                        </select>
                      </div>

                    </div>
                  </div>
                </div>
                </div>
              </div>


              <footer className="footer footer-center p-4 text-base-content">
                <aside>
                  <p>Copyright © 2024</p>
                </aside>
              </footer>
            </div>
          </div>
        </div>
      </div>
  )
}
