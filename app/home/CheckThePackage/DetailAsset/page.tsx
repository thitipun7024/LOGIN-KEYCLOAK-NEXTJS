// "use client";
// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import {jwtDecode} from "jwt-decode";
// import { Token } from "next-auth/jwt";

// export default function Page() {
//   const { data: session, status } = useSession();
//   const [sakHQ, setSakHQ] = useState<string | null>(null);
//   const [noAsset, setNoAsset] = useState<string[]>([]);
//   const [dataAsset, setDataAsset] = useState([]);
//   const [resultGroupBranch, setResultGroupBranch] = useState<string | null>(null);
//   const [resultGroupBaD_TH2, setResultGroupBaD_TH2] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const dataDetailAsset = sessionStorage.getItem("NoAsset");
//     if (dataDetailAsset) {
//       const parsedDataDetailAsset = JSON.parse(dataDetailAsset);
//       setNoAsset(parsedDataDetailAsset);
//     } else {
//       console.log("ไม่มีข้อมูลใน sessionStorage");
//     }
//   }, []);

//   useEffect(() => {
//     if (session) {
//       const decoded = jwtDecode<Token>(session.accessToken);

//       const findGroupBranch = decoded.groups.find((group) => {
//         return (
//           group.includes("/group/SAK BRANCH/") ||
//           group.includes("/group/SAK HQ/")
//         );
//       });
//       const resultGroupBranch = findGroupBranch ? findGroupBranch.split("/").pop() : "primary";
//       setResultGroupBranch(resultGroupBranch);

//       const findGroupBaD_TH = decoded.groups.find((group) => {
//         return (
//           group.includes("/group/SAK BRANCH_TH/") ||
//           group.includes("/group/SAK DEPARTMENT-TH/")
//         );
//       });
//       const resultGroupBaD_TH = findGroupBaD_TH ? findGroupBaD_TH.split("/").pop() : "ไม่มีข้อมุลชื่อสาขา/หน่วย";
//       setResultGroupBaD_TH2(resultGroupBaD_TH);

//       const fetchDataSakHQ = async () => {
//         try {
//           setIsLoading(true);
//           const responseSakHQ = await fetch(`/api/asset/GetNoSakHQ?SakHQ=${resultGroupBaD_TH}`, {
//             method: "GET",
//             headers: {
//               "Cache-Control": "no-cache",
//               Pragma: "no-cache",
//             },
//           });
//           const SakHQJson = await responseSakHQ.json();
//           if (SakHQJson && SakHQJson.CostCenter) {
//             setSakHQ(SakHQJson.CostCenter);
//           } else {
//             console.log("No CostCenter data available.");
//           }
//         } catch (error) {
//           console.error("Error fetching SakHQ data:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchDataSakHQ();
//     }
//   }, [session, resultGroupBaD_TH2]);

//   useEffect(() => {
//     if (resultGroupBranch || sakHQ || session) {
//       const fetchDataDetailAsset = async () => {
//         try {
//           const responseDetailAsset = await fetch(
//             `/api/asset/GetDetailAsset?resultGroupBranch=${resultGroupBranch}&SakHQ=${sakHQ}&NoAsset=${noAsset}`,
//             {
//               method: "GET",
//               headers: {
//                 "Cache-Control": "no-cache",
//                 Pragma: "no-cache",
//               },
//             }
//           );
//           const dataDetailAsset = await responseDetailAsset.json();
//           setDataAsset(dataDetailAsset);
//         } catch (error) {
//           console.error("Error fetching detail asset:", error);
//         }
//       };

//       fetchDataDetailAsset();
//     }
//   }, [sakHQ, resultGroupBranch, noAsset]);

//   if (status === "loading") {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <span className="loading loading-dots loading-lg text-blue-950"></span>
//       </div>
//     );
//   }

//   if (!session || !session.accessToken) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p>Logout...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="background2">
//       <div className="flex flex-col justify-center items-center min-h-screen">
//         <div className="absolute top-0 left-0 right-0 lg:h-56 md:h-48 sm:h-48 h-44 bg-blue-950 transform rounded-b-3xl">
//           <a className="btn btn-ghost mt-5 ml-3 text-white" href="/home">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="30"
//               height="30"
//               fill="currentColor"
//               className="bi bi-chevron-double-left"
//               viewBox="0 0 16 16"
//             >
//               <path d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
//               <path d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708z" />
//             </svg>
//           </a>
//           {dataAsset.map((data) => (
//             <div className="flex flex-col justify-center items-center mt-1" key={data.ID}>
//               <img
//                 src="https://minio.saksiam.co.th/public/saktech/logo/LogoParcel.png"
//                 className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 lg:-mt-20 md:-mt-16 sm:-mt-16 -mt-16"
//               />
//               <div className="card bg-clip-border lg:w-2/5 md:w-3/5 w-11/12 p-1 bg-base-100 shadow-xl flex flex-flex-col items-center justify-center h-20 text-center">
//                 <h2 className="lg:text-2xl md:text-1xl sm:text-2xl text-2xl font-bold">{data ? data.Asset_description : "Loading..."}</h2>
//               </div>
//               <div className="mt-8"></div>
//               <div className="container contents">
//                 <div className="container flex items-center justify-center mb-2">
//                   <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
//                     <div className="card-body">
//                       <h2 className="text-center text-xl -mt-5">รายละเอียด</h2>
//                       <div className="grid lg:gap-x-20 md:gap-x-20 sm:gap-x-20 gap-x-3 gap-y-10 lg:grid-cols-2 md:grid-cols-2 grid-cols-2 justify-center mt-5">
//                         <div className="flex flex-col items-center">
//                           <h2 className="font-bold mb-1">Asset</h2>
//                           {data ? data.Asset : "Loading..."}
//                         </div>
//                         <div className="flex flex-col items-center text-center">
//                           <h2 className="font-bold mb-1 text-wrap">ชื่อสินทรัพย์</h2>
//                           {data ? data.Asset_description : "Loading..."}
//                         </div>
//                         <div className="flex flex-col items-center">
//                           <h2 className="font-bold mb-1">ประเภทพัสดุ</h2>
//                           {data ? data.Asset_class_description : "Loading..."}
//                         </div>
//                         <div className="flex flex-col items-center">
//                           <h2>สังกัด</h2>
//                           {resultGroupBaD_TH2}
//                         </div>
//                         <div className="flex flex-col items-center">
//                           <h2>สถานะ</h2>
//                           <select className="select select-bordered select-sm w-32 max-w-xs text-black">
//                             <option>รอตรวจนับ</option>
//                             <option>ปกติ</option>
//                             <option>โยกย้าย</option>
//                             <option>อื่นๆ</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <footer className="footer footer-center p-4 text-base-content">
//                 <aside>
//                   <p>Copyright © 2024</p>
//                 </aside>
//               </footer>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";

// interface DataAsset {
//   Asset: any;
// }

export default function Page() {
  const { data: session, status } = useSession();
  const [sakHQ, setSakHQ] = useState<string | null>(null);
  const [noAsset, setNoAsset] = useState<string[]>([]);
  const [dataAsset, setDataAsset] = useState([])
  const [resultGroupBranch, setResultGroupBranch] = useState(null);
  const [resultGroupBaD_TH2, setResultGroupBaD_TH2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dataDetailAsset = sessionStorage.getItem("NoAsset");
    if (dataDetailAsset) {
      const parsedDataDetailAsset = JSON.parse(dataDetailAsset);
      setNoAsset(parsedDataDetailAsset);
    } else {
      console.log("ไม่มีข้อมูลใน sessionStorage");
    }
  }, []);

  useEffect(() => {
    if (session) {
      const decoded = jwtDecode<Token>(session.accessToken);
      //console.log(decoded);
  
      // ดึงข้อมูลที่เป็นข้อมูลฝ่ายหรือข้อมูล Branch
      const findGroupBranch = decoded.groups.find((group) => {
        return (
          group.includes("/group/SAK BRANCH/") ||
          group.includes("/group/SAK HQ/")
        );
      });
      const resultGroupBranch = findGroupBranch
        ? findGroupBranch.split("/").pop()
        : "primary";
      setResultGroupBranch(resultGroupBranch);
  
      // ดึงข้อมูลที่เป็นข้อมูลตำแหน่งของพนักงาน
      const findGroupPosition = decoded.groups.find((group) => {
        return group.includes("/group/SAK POSITION_TH/");
      });
      const resultGroupPosition = findGroupPosition
        ? findGroupPosition.split("/").pop()
        : "primary";
  
      // ดึงข้อมูลที่เป็นข้อมูลชื่อสาขา/หน่วยและฝ่ายภาษาไทย
      const findGroupBaD_TH = decoded.groups.find((group) => {
        return (
          group.includes("/group/SAK BRANCH_TH/") ||
          group.includes("/group/SAK DEPARTMENT-TH/")
        );
      });
      const resultGroupBaD_TH = findGroupBaD_TH
        ? findGroupBaD_TH.split("/").pop()
        : "ไม่มีข้อมูลชื่อสาขา/หน่วย";
      setResultGroupBaD_TH2(resultGroupBaD_TH);
    }
  }, [session]);
  
  useEffect(() => {
    if (resultGroupBaD_TH2) {
      const fetchDataSakHQ = async () => {
        try {
          const responseSakHQ = await fetch(
            `/api/asset/GetNoSakHQ?SakHQ=${resultGroupBaD_TH2}`,
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
            setSakHQ(SakHQJson.CostCenter);
          } else {
            console.log("No CostCenter data available.");
          }
        } catch (error) {
          console.error("Error fetching SakHQ data:", error);
        }
      };
  
      fetchDataSakHQ();
    }
  }, [resultGroupBaD_TH2]);
  
  useEffect(() => {
    if (session && sakHQ && resultGroupBranch) {
      const fetchDataDetailAsset = async () => {
        try {
          const responseDetailAsset = await fetch(
            `/api/asset/GetDetailAsset?resultGroupBranch=${resultGroupBranch}&SakHQ=${sakHQ}&NoAsset=${noAsset}`,
            {
              method: "GET",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            }
          );
          const dataDetailAsset = await responseDetailAsset.json();
          
          // Ensure dataDetailAsset is an array
          if (Array.isArray(dataDetailAsset)) {
            setDataAsset(dataDetailAsset);
          } else {
            setDataAsset([]);
            console.warn("Fetched data is not an array:", dataDetailAsset);
          }
        } catch (error) {
          console.error("Error fetching detail asset:", error);
        }
      };
  
      fetchDataDetailAsset();
    }
  }, [sakHQ, session, noAsset, resultGroupBranch]);
  

  //console.log(dataAsset)

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
          {dataAsset.map((data) => (
                      <div className="flex flex-col justify-center items-center mt-1" key={data.ID}>
                      <img
                        src="https://minio.saksiam.co.th/public/saktech/logo/LogoParcel.png"
                        className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 lg:-mt-20 md:-mt-16 sm:-mt-16 -mt-16"
                      />
                      <div className="card bg-clip-border lg:w-2/5 md:w-3/5 w-11/12 p-1 bg-base-100 shadow-xl flex flex-flex-col items-center justify-center h-20 text-center">
                        <h2 className="lg:text-2xl md:text-1xl sm:text-2xl text-2xl font-bold">{data ? data.Asset_description : "Loading..."}</h2>
                      </div>
          
                      <div className="mt-8"></div>
          
                      <div className="container contents">
                        <div className="container flex items-center justify-center mb-2">
                          <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                            <div className="card-body">
                              <h2 className="text-center text-xl -mt-5">รายละเอียด</h2>
          
                                  <div className="grid lg:gap-x-20 md:gap-x-20 sm:gap-x-20 gap-x-3 gap-y-10 lg:grid-cols-2 md:grid-cols-2 grid-cols-2 justify-center mt-5">
                                  <div className="flex flex-col items-center">
                                    <h2 className=" font-bold mb-1">Asset</h2>
                                    {data ? data.Asset : "Loading..."}
                                  </div>
            
                                  <div className="flex flex-col items-center text-center">
                                    <h2 className="font-bold mb-1 text-wrap">ชื่อสินทรัพย์</h2>
                                    {data ? data.Asset_description : "Loading..."}
                                  </div>
            
                                  <div className="flex flex-col items-center">
                                    <h2 className=" font-bold mb-1">ประเภทพัสดุ</h2>
                                    {data ? data.Asset_class_description : "Loading..."}
                                  </div>
            
                                  <div className="flex flex-col items-center">
                                    <h2>สังกัด</h2>
                                    {resultGroupBaD_TH2}
                                  </div>
            
                                  <div className="flex flex-col items-center">
                                    <h2>สถานะ</h2>
                                    <select className="select select-bordered select-sm w-32 max-w-xs text-black">
                                      <option>รอตรวจนับ</option>
                                      <option>ปกติ</option>
                                      <option>โยกย้าย</option>
                                      <option>อื่นๆ</option>
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
          ))}

        </div>
      </div>
    </div>
  );
}
