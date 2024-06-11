"use client";
import React from "react";
import Logout from "@/components/Logout";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg text-blue-950"></span>
      </div>
    );
  }

  if (!session || !session.accessToken) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Logout...</p>
      </div>
    );
  }

  const decoded = jwtDecode<Token>(session.accessToken);
  //console.log(decoded);

  //ดึงข้อมูลที่เป็น ข้อมูลฝ่าย หรือ ข้อมูล Branch
  const findGroupBranch = decoded.groups.find((group) => {
    return (
      group.includes("/group/SAK BRANCH/") || group.includes("/group/SAK HQ/")
    );
  });
  const resultGroupBranch = findGroupBranch ? (
    findGroupBranch.split("/").pop()
  ) : (
    <div className="badge badge-primary badge-outline">primary</div>
  );
  //ดึงข้อมูลที่เป็น ข้อมูลฝ่าย หรือ ข้อมูล Branch

  //ดึงข้อมูลที่เป็นข้อมูลตำเเหน่งของพนักงาน
  const findGroupPosition = decoded.groups.find((group) => {
    return group.includes("/group/SAK POSITION_TH/");
  });
  const resultGroupPosition = findGroupPosition ? (
    findGroupPosition.split("/").pop()
  ) : (
    <div className="badge badge-primary badge-outline">primary</div>
  );
  //ดึงข้อมูลที่เป็นข้อมูลตำเเหน่งของพนักงาน


  return (
    <div className="background2">
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="absolute top-0 left-0 right-0 h-44 bg-blue-950 transform rounded-b-3xl">
          <div className="flex flex-col justify-center items-center mt-16">
            <h2 className="text-white lg:text-4xl text-2xl  font-bold mb-4">
              ระบบตรวจนับพัสดุ
            </h2>
            <div className="card bg-clip-border lg:w-2/5 md:w-2/4 w-11/12 p-1 bg-base-100  shadow-xl flex flex-row items-center justify-center">
              <img
                src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png"
                className="lg:h-28 h-20 lg:w-28 w-20 m-4 lg:-ml-1 ml-2"
              />
              <div className="flex flex-col lg:ml-5 ml-0">
                <h2 className="lg:text-2xl md:text-1xl text-xl font-bold ">
                  {decoded.displayName}
                </h2>
                <h2 className="lg:text-lg md:text-lg text-sm mb-1">
                  {resultGroupPosition}
                </h2>
                <h2 className="lg:text-lg md:text-lg text-sm">
                  {resultGroupBranch}
                </h2>
              </div>
              <div className="lg:ml-7 ml-3 lg:pr-0 pr-1">
                <button
                  className=""
                  onClick={() =>
                    (
                      document.getElementById("my_modal_1") as HTMLDialogElement
                    ).showModal()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="38"
                    height="38"
                    fill="currentColor"
                    className="bi bi-box-arrow-right ml-1 text-red-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                    <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="container contents">
              <div className="grid lg:gap-x-20 md:gap-x-20 gap-x-3 gap-y-4 lg:grid-cols-6 md:grid-cols-6 grid-cols-3 mt-10 justify-center">
                <div className="flex flex-col items-center">
                  <a href="/home/CheckThePackage">
                    <button className="flex items-center justify-center btn btn-primary bg-blue-950 border-0 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                      <img
                        src="https://minio.saksiam.co.th/public/saktech/logo/12345.png"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  </a>
                  <span className="mt-2 text-center font-bold">ตรวจพัสดุ</span>
                </div>

                <div className="flex flex-col items-center">
                  <button className="flex items-center justify-center btn h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                    <img
                      src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <span className="mt-2 text-center">ข้อความที่ต้องการ</span>
                </div>

                <div className="flex flex-col items-center">
                  <button className="flex items-center justify-center btn h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                    <img
                      src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <span className="mt-2 text-center">ข้อความที่ต้องการ</span>
                </div>

                <div className="flex flex-col items-center">
                  <button className="flex items-center justify-center btn h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                    <img
                      src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <span className="mt-2 text-center">ข้อความที่ต้องการ</span>
                </div>

                <div className="flex flex-col items-center">
                  <button className="flex items-center justify-center btn h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                    <img
                      src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <span className="mt-2 text-center">ข้อความที่ต้องการ</span>
                </div>

                <div className="flex flex-col items-center">
                  <button className="flex items-center justify-center btn h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                    <img
                      src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <span className="mt-2 text-center">ข้อความที่ต้องการ</span>
                </div>
              </div>
            </div>

            <footer className="footer footer-center p-4 text-base-content mt-80">
              <aside>
                <p>Copyright © 2024</p>
              </aside>
            </footer>
          </div>
        </div>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">ยืนยันการออกจากระบบ!</h3>
          <p className="py-4">คุณยืนยันที่จะออกจากระบบใช่หรือไม่</p>
          <div className="modal-action flex items-center">
            <form method="dialog" className="flex items-center">
              <Logout />
              <button className="btn ml-2">ยกเลิก</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
