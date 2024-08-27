"use client";
import React, { useState, useEffect } from "react";
import Logout from "@/components/Logout";
import asset_log from "../../function/asset_log";
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
  const [resultGroupBranch, setResultGroupBranch] = useState<string | null>(
    null
  );
  const [resultGroupBaD_TH, setResultGroupBaD_TH] = useState<string | null>(
    null
  );
  const [usedecoded, setUseDecoded] = useState<Token | null>(null);
  const [useresultGroupPosition, setUseResultGroupPosition] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (session && session.accessToken) {
      const decoded = jwtDecode<Token>(session.accessToken);
      setUseDecoded(decoded);

      // ดึงข้อมูลที่เป็น ข้อมูลฝ่าย หรือ ข้อมูล Branch
      const findGroupBranch = decoded.groups.find((group) => {
        return (
          group.includes("/group/SAK BRANCH/") ||
          group.includes("/group/SAK HQ/")
        );
      });
      const resultBranch = findGroupBranch
        ? findGroupBranch.split("/").pop()
        : "primary";
      setResultGroupBranch(resultBranch);

      // ดึงข้อมูลที่เป็นข้อมูลตำเเหน่งของพนักงาน
      const findGroupPosition = decoded.groups.find((group) => {
        return group.includes("/group/SAK POSITION_TH/");
      });
      const resultGroupPosition = findGroupPosition
        ? findGroupPosition.split("/").pop()
        : "primary";
      setUseResultGroupPosition(resultGroupPosition);

      // ดึงข้อมูลที่เป็นข้อมูลชื่อสาขา/หน่วย เเละ ฝ่ายภาษาไทย
      const findGroupBaD = decoded.groups.find((group) => {
        return (
          group.includes("/group/SAK BRANCH_TH/") ||
          group.includes("/group/SAK DEPARTMENT-TH/")
        );
      });
      const resultBaD_TH = findGroupBaD
        ? findGroupBaD.split("/").pop()
        : "พี่เคนไม่เพิ่มให้";
      setResultGroupBaD_TH(resultBaD_TH);
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      if (resultGroupBranch || sakHQ !== null) {
        try {
          // Fetch count data
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
          setCount(count);
        } catch (error) {
          console.error("Error fetching count data:", error);
        }

        // Fetch data for No Checked
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
          setCountNoChecked(countAssetNoChecked || 0);
        } catch (error) {
          console.error("Error fetching no checked data:", error);
        }

        // Fetch data for Checked
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
          if (countAssetChecked === undefined || countAssetChecked === null) {
            setCountChecked(0);
          } else {
            setCountChecked(countAssetChecked);
          }
        } catch (error) {
          console.error("Error fetching checked data:", error);
        }
      }
    };

    if (resultGroupBranch || sakHQ !== null) {
      fetchData();
    }
  }, [resultGroupBranch, sakHQ]);

  useEffect(() => {
    const fetchSakHQ = async () => {
      if (resultGroupBaD_TH) {
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
          setSakHQ(SakHQJson.CostCenter || null);
        } catch (error) {
          //console.error("Error fetching SakHQ data:", error);
        }
      }
    };

    if (resultGroupBaD_TH) {
      fetchSakHQ();
    }
  }, [resultGroupBaD_TH]);

  useEffect(() => {
    const fetchBranchCodeDetails = async () => {
      if (resultGroupBranch && !hasFetched) {
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
          setDataBranchCode(
            Array.isArray(dataBranchCode) ? dataBranchCode : []
          );
          setHasFetched(true);
        } catch (error) {
          console.error("Error fetching detail asset:", error);
        }
      }
    };

    fetchBranchCodeDetails();
  }, [resultGroupBranch, hasFetched]);

  const ClickCheckThePackagelog = async () => {
    try {
      await asset_log(
        usedecoded.username,
        resultGroupBranch,
        "ปุ่มตรวจนับสินทรัพย์",
        "ปุ่มเข้าหน้าตรวจนับสินทรัพย์",
        "",
        "",
        ""
      );
      window.location.href = "/home/CheckThePackage";
    } catch (error) {
      console.error("Error logging action:", error);
    }
  };

  const ClickCheckedlog = async () => {
    try {
      await asset_log(
        usedecoded.username,
        resultGroupBranch,
        "ปุ่มสินทรัพย์ที่ถูกตรวจนับเเล้ว",
        "ปุ่มเข้่าหน้าสินทรัพย์ที่ถูกตรวจนับเเล้ว",
        "",
        "",
        ""
      );
      window.location.href = "/home/Checked";
    } catch (error) {
      console.error("Error logging action:", error);
    }
  };

  const ClickLogout = async () => {
    try {
      await asset_log(
        usedecoded.username,
        resultGroupBranch,
        "ปุ่มออกจากระบบ",
        "ออกจากระบบ",
        "",
        "",
        ""
      );
    } catch (error) {
      console.error("Error logging action:", error);
    }
  };

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

  return (
    <div className="background2">
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="absolute top-0 left-0 right-0 lg:h-64 md:h-60 sm:h-48 h-44 bg-blue-950 transform rounded-b-3xl">
          <div className="flex flex-col justify-center items-center mt-16">
            <div className="lg:h-32 md:h-32 sm:h-24 h-20 lg:w-48 md:w-48 sm:w-24 w-36 lg:-mt-12 md:-mt-12 sm:-mt-16 -mt-12 mb-7">
              <Image
                src="https://minio.saksiam.co.th/public/saktech/logo/LOGO-ASSET-V2.png"
                alt="Picture of the author"
                style={{
                  width: "100%",
                  height: "auto",
                }}
                width={1200}
                height={0}
                priority
              />
            </div>
            <div className="card bg-clip-border w-auto lg:pl-10 md:pl-4 sm:pl-0 pl-2 lg:pr-10 md:pr-4 sm:pr-0 pr-2 lg:pt-2 md:pt-4 sm:pt-0 pt-1 lg:pb-2 md:pb-4 sm:pb-0 pb-1 bg-base-100 shadow-xl flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-between m-1">
              <div className="lg:h-32 md:h-28 sm:h-16 h-16 lg:w-32 md:w-28 sm:w-16 w-16 lg:mr-6 md:mr-3 sm:mr-2 mr-2">
                <Image
                  src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png"
                  alt="alt"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  width={1000}
                  height={0}
                  priority
                />
              </div>

              <div className="flex flex-col flex-grow text-center">
                <h2 className="lg:text-2xl md:text-1xl sm:text-xl text-lg lg:w-full md:w-full sm:w-full w-full font-extrabold ">
                  {usedecoded ? usedecoded.displayName : "Loading..."}
                </h2>
                <h2 className="lg:text-lg md:text-lg sm:text-sm text-sm lg:w-full md:w-60 sm:w-full w-48 break-words whitespace-normal">
                  {useresultGroupPosition}
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

              <div className="lg:ml-7 md:ml-6 sm:ml-2 lg:h-14 md:h-9 h-10 lg:w-14 md:w-12 w-10 ml-2 pr-1">
                <button
                  className=""
                  onClick={() =>
                    (
                      document.getElementById("my_modal_1") as HTMLDialogElement
                    ).showModal()
                  }
                >
                  <Image
                    src="https://minio.saksiam.co.th/public/saktech/logo/logout.png"
                    alt="Picture of the author"
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    width={1200}
                    height={0}
                    priority
                  />
                </button>
              </div>
              </div>
            </div>

            <div className="container contents">
              <div className="grid lg:gap-x-20 md:gap-x-10 sm:gap-x-1 gap-x-2 gap-y-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 grid-cols-3  mt-5 justify-center">
                <div className="flex flex-col items-center">
                  <div className="card lg:w-48 md:w-40 sm:w-28 w-28 h-20 text-white bg-blue-950">
                    <div className="card-body items-center text-center ">
                      <h2 className="lg:text-lg md:text-lg sm:text-xs text-xs font-bold lg:-mt-5 md:-mt-5 sm:-mt-3 -mt-3 lg:w-36 md:w-36 sm:w-20 w-24">
                        สินทรัพย์ทั้งหมด
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
                  <a onClick={ClickCheckThePackagelog}>
                    <button className="flex items-center justify-center btn btn-primary bg-blue-950 border-0 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                      <div className="h-full w-full object-cover">
                        <Image
                          src="https://minio.saksiam.co.th/public/saktech/logo/Iconasset2.png"
                          alt="Picture of the author"
                          style={{
                            width: "100%",
                            height: "auto",
                          }}
                          width={1200}
                          height={0}
                          priority
                        />
                      </div>
                    </button>
                  </a>
                  <span className="mt-2 text-center font-bold">
                    ตรวจสอบสินทรัพย์
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <a onClick={ClickCheckedlog}>
                    <button className="flex items-center justify-center btn btn-primary bg-blue-950 border-0 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 p-2">
                      <Image
                        src="https://minio.saksiam.co.th/public/saktech/logo/checklist.png"
                        alt="Picture of the author"
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                        width={1200}
                        height={0}
                        priority
                      />
                    </button>
                  </a>
                  <span className="mt-2 text-center font-bold custom-font">
                    สินทรัพย์ที่ถูกตรวจสอบเเล้ว
                  </span>
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
              <Logout onClick={ClickLogout} />
              <button className="btn ml-2">ยกเลิก</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
