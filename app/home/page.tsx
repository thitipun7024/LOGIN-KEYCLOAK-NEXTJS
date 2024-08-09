"use client";
import React, { useEffect, useState } from "react";
import Logout from "@/components/Logout";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";
import Image from "next/image";
import "../globals.css";

export default function Page() {
  const { data: session, status } = useSession();
  const [count, setCount] = useState([]);
  const [sakHQ, setSakHQ] = useState(null);
  const [countNochecked, setCountNoChecked] = useState(null);
  const [countChecked, setCountChecked] = useState(null);
  const [dataBranchCode, setDataBranchCode] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);


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

  //ดึงข้อมูลที่เป็นข้อมูลชื่อสาขา/หน่วย เเละ ฝ่ายภาษาไทย
  const findGroupBaD_TH = decoded.groups.find((group) => {
    return (
      group.includes("/group/SAK BRANCH_TH/") ||
      group.includes("/group/SAK DEPARTMENT-TH/")
    );
  });
  const resultGroupBaD_TH = findGroupBaD_TH ? (
    findGroupBaD_TH.split("/").pop()
  ) : (
    <div className="badge badge-error badge-outline">พี่เคนไม่เพิ่มให้</div>
  );
  //ดึงข้อมูลที่เป็นข้อมูลชื่อสาขา/หน่วย เเละ ฝ่ายภาษาไทย

  //Function
  const ClickParamGroup = () => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `/api/asset/GetDataAsset?resultGroupBranch=${resultGroupBranch}&SakHQ=${sakHQ}`,
            {
              method: "GET",
              redirect: "follow",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            }
          );
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    } else {
      alert("ไม่มีการเข้าสู่ระบบ");
    }
  };
  //Function

  //Function
  const fetchDataCount = async () => {
    try {
      const response = await fetch(
        `/api/asset/CountDataAsset?resultGroupBranch=${resultGroupBranch}&SakHQ=${sakHQ}`,
        {
          method: "GET",
          redirect: "follow",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );
      const { count } = await response.json();
      //console.log(count);
      setCount(count);
    } catch (error) {
      console.log(error);
    }
  };
  fetchDataCount();
  //Function

  //Function
  const fetchDataCountNochecked = async () => {
    try {
      const responseNoasset = await fetch(
        `/api/asset/CountDataStatusNoCheck?resultGroupBranch=${resultGroupBranch}&SakHQ=${sakHQ}`,
        {
          method: "GET",
          redirect: "follow",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      const { countAssetNoChecked } = await responseNoasset.json();

      if (countAssetNoChecked === undefined || countAssetNoChecked === null) {
        setCountNoChecked(0);
      } else {
        setCountNoChecked(countAssetNoChecked);
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchDataCountNochecked();
  //Function

  //Function
  const fetchDataCountChecked = async () => {
    try {
      const responseChecked = await fetch(
        `/api/asset/CountDataAssetChecked?resultGroupBranch=${resultGroupBranch}&SakHQ=${sakHQ}`,
        {
          method: "GET",
          redirect: "follow",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );
      const { countAssetChecked } = await responseChecked.json();
      //console.log(countAssetChecked);

      if (countAssetChecked === undefined || countAssetChecked === null) {
        setCountChecked(0);
      } else {
        setCountChecked(countAssetChecked);
      }
    } catch (error) {
      console.log(error);
    }
  };
  fetchDataCountChecked();
  //Function

  //Function
  const fetchDataSakHQ = async () => {
    try {
      const responseSakHQ = await fetch(
        `/api/asset/GetNoSakHQ?SakHQ=${resultGroupBaD_TH}`,
        {
          method: "GET",
          redirect: "follow",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (!responseSakHQ.ok) {
        throw new Error(`HTTP error! Status: ${responseSakHQ.status}`);
      }

      const SakHQJson = await responseSakHQ.json();

      if (SakHQJson && SakHQJson.CostCenter) {
        const costCenter = SakHQJson.CostCenter;
        setSakHQ(costCenter);
      } else {
        //console.log("No CostCenter data available.");
      }
    } catch (error) {
      console.error("Error fetching SakHQ data:", error);
    }
  };
  fetchDataSakHQ();
  //Function

  //Function
  const fetchDataDetailBranchCode = async () => {
    if (!hasFetched) { 
      try {
        const responseDetailAsset = await fetch(
          `/api/asset/GetBranchCode?BranchCode=${resultGroupBranch}`,
          {
            method: "GET",
            redirect: "follow",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );

        const dataBranchCode = await responseDetailAsset.json();

        if (Array.isArray(dataBranchCode)) {
          setDataBranchCode(dataBranchCode);
        } else {
          setDataBranchCode([]);
        }
        setHasFetched(true); // ตั้งค่าว่าได้ดึงข้อมูลแล้ว
      } catch (error) {
        console.error("Error fetching detail asset:", error);
      }
    }
  };

  if (!hasFetched) {
    fetchDataDetailBranchCode();
  }
  //Function

  return (
    <div className="background2">
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="absolute top-0 left-0 right-0 lg:h-64 md:h-56 sm:h-48 h-44 bg-blue-950 transform rounded-b-3xl">
          <div className="flex flex-col justify-center items-center mt-16">
            <div className="lg:h-32 md:h-32 sm:h-24 h-20 lg:w-48 md:w-48 sm:w-24 w-36 lg:-mt-12 md:-mt-12 sm:-mt-16 -mt-12 mb-5">
            <Image
              src="https://minio.saksiam.co.th/public/saktech/logo/LOGO-ASSET-V2.png"
              alt="Picture of the author"
              style={{
                width: '100%',
                height: 'auto',
              }}
              width={1200}
              height={0}
              priority
            />
            </div>
            <div className="card bg-clip-border w-auto lg:pl-10 md:pl-4 sm:pl-0 pl-2 lg:pr-10 md:pr-4 sm:pr-0 pr-2 lg:pt-2 md:pt-4 sm:pt-0 pt-1 lg:pb-2 md:pb-4 sm:pb-0 pb-1 bg-base-100 shadow-xl flex flex-row items-center justify-center">
              <div className="lg:h-32 h-20 lg:w-32 w-20 m-4 lg:-ml-1 ml-2">
                <Image 
                  src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png" 
                  alt="alt" 
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  width={1200}
                  height={0} 
                  priority
                />
              </div>
              <div className="flex flex-col lg:ml-5 md:ml-5 sm:ml-5 ml-0">
                <h2 className="lg:text-2xl md:text-1xl text-xl font-bold ">
                  {decoded.displayName}
                </h2>
                <h2 className="lg:text-lg md:text-lg lg:w-60 md:w-60 sm:w-full w-56 text-sm break-words whitespace-normal">
                  {resultGroupPosition}
                </h2>
                <h2 className="lg:text-lg md:text-lg text-sm">
                {dataBranchCode.map((item) =>
                                item ? (
                                  item.Name
                                ) : (
                                  <span
                                    className="loading loading-dots loading-md"
                                    key={item.CostCenter}
                                  ></span>
                                )
                              )}
                </h2>
              </div>
              <div className="lg:ml-2 md:ml-5 sm:ml-3 -ml-12 pr-1">
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
              <div className="grid lg:gap-x-20 md:gap-x-10 sm:gap-x-1 gap-x-2 gap-y-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 grid-cols-3  mt-5 justify-center">
                <div className="flex flex-col items-center">
                  <div className="card lg:w-48 md:w-40 sm:w-28 w-28 h-20 text-white bg-blue-950">
                    <div className="card-body items-center text-center ">
                      <h2 className="lg:text-lg md:text-lg sm:text-xs text-xs font-bold lg:-mt-5 md:-mt-5 sm:-mt-3 -mt-3 lg:w-32 md:w-32 sm:w-20 w-24">
                        ทรัพย์สินทั้งหมด
                      </h2>
                      <a className="lg:text-xl md:text-xl sm:text-xl text-xl font-bold -mt-1">
                        {/* {count ? count : <span className="loading loading-dots loading-md"></span>} */}
                        {count}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="card lg:w-48 md:w-40 sm:w-32 w-28 h-20 text-white bg-blue-950">
                    <div className="card-body items-center text-center ">
                    <h2 className="lg:text-lg md:text-lg sm:text-xs text-xs font-bold lg:-mt-5 md:-mt-5 sm:-mt-3 -mt-3 lg:w-28 md:w-24 sm:w-20 w-20">
                        ตรวจเเล้ว
                      </h2>
                      <a className="lg:text-xl md:text-xl sm:text-xl text-xl font-bold -mt-1">
                        {/* {countChecked ? countChecked : <span className="loading loading-dots loading-md"></span>} */}
                        {countChecked}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="card lg:w-48 md:w-40 sm:w-32 w-28 h-20 text-white bg-blue-950">
                    <div className="card-body items-center text-center ">
                    <h2 className="lg:text-lg md:text-lg sm:text-xs text-xs font-bold lg:-mt-5 md:-mt-5 sm:-mt-3 -mt-3 lg:w-28 md:w-24 sm:w-20 w-20">
                        รอการตรวจ
                      </h2>
                      <a className="lg:text-xl md:text-xl sm:text-xl text-xl font-bold -mt-1">
                        {/* {countNochecked ? countNochecked : <span className="loading loading-dots loading-md"></span>} */}
                        {countNochecked}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container contents">
              <div className="grid lg:gap-x-28 md:gap-x-10 sm:gap-x-5 gap-x-2 gap-y-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-3 grid-cols-2 lg:mt-12 md:mt-20 sm:mt-10 mt-7 justify-center">
                <div className="flex flex-col items-center">
                  <a href="/home/CheckThePackage" onClick={ClickParamGroup}>
                    <button className="flex items-center justify-center btn btn-primary bg-blue-950 border-0 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                      {/* <img
                        src="https://minio.saksiam.co.th/public/saktech/logo/Iconasset2.png"
                        alt=""
                        className="h-full w-full object-cover"
                      /> */}
                      <div className="h-full w-full object-cover">
                      <Image
                        src="https://minio.saksiam.co.th/public/saktech/logo/Iconasset2.png"
                        alt="Picture of the author"
                        style={{
                          width: '100%',
                          height: 'auto',
                        }}
                        width={1200}
                        height={0}
                        priority
                      />
                      </div>
                    </button>
                  </a>
                  <span className="mt-2 text-center font-bold">ตรวจทรัพย์สิน</span>
                </div>

                <div className="flex flex-col items-center">
                  <a href="/home/Checked">
                    <button className="flex items-center justify-center btn btn-primary bg-blue-950 border-0 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                      <Image
                        src="https://minio.saksiam.co.th/public/saktech/logo/checklist.png"
                        alt="Picture of the author"
                        style={{
                          width: '100%',
                          height: 'auto',
                        }}
                        width={1200}
                        height={0}
                        priority
                      />
                    </button>
                  </a>
                  <span className="mt-2 text-center font-bold custom-font">ทรัพย์สินที่ถูกตรวจนับเเล้ว</span>
                </div>

              </div>
            </div>

            <footer className="footer footer-center p-4 text-base-content lg:mt-28 md:mt-80 sm:mt-32 mt-52">
                <aside>
                    <p className="lg:text-base md:text-base sm:text-sm text-sm">
                    © 2024 All Right Reserve By SakTech
                    </p>
                    <p className="lg:text-base md:text-base sm:text-sm text-sm">
                    VERSION {process.env.NEXT_PUBLIC_VERSION}
                    </p>
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
