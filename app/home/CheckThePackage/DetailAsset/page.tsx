"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCamera } from "@fortawesome/free-solid-svg-icons";


export default function Page() {
  const { data: session, status } = useSession();
  const [sakHQ, setSakHQ] = useState<string | null>(null);
  const [noAsset, setNoAsset] = useState<string[]>([]);
  const [dataAsset, setDataAsset] = useState([]);
  const [resultGroupBranch, setResultGroupBranch] = useState(null);
  const [resultGroupBaD_TH2, setResultGroupBaD_TH2] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [statusselect, setStatusSlect] = useState("รอตรวจนับ");
  const [textareaValue, setTextareaValue] = useState('');
  const [dataBranchCode, setDataBranchCode] = useState([]);
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
      setResultGroupBaD_TH2(resultGroupBaD_TH);
    }
  }, [session]);

  // useEffect(() => {
  //   if (resultGroupBaD_TH2) {
  //     const fetchDataSakHQ = async () => {
  //       try {
  //         const responseSakHQ = await fetch(
  //           `/api/asset/GetNoSakHQ?SakHQ=${resultGroupBaD_TH2}`,
  //           {
  //             method: "GET",
  //             redirect: "follow",
  //             headers: {
  //               "Cache-Control": "no-cache",
  //               Pragma: "no-cache",
  //             },
  //           }
  //         );

  //         if (!responseSakHQ.ok) {
  //           throw new Error(`HTTP error! Status: ${responseSakHQ.status}`);
  //         }

  //         const SakHQJson = await responseSakHQ.json();

  //         if (SakHQJson && SakHQJson.CostCenter) {
  //           setSakHQ(SakHQJson.CostCenter);
  //         } else {
  //           //console.log("No CostCenter data available.");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching SakHQ data:", error);
  //       }
  //     };

  //     fetchDataSakHQ();
  //   }
  // }, [resultGroupBaD_TH2]);

  useEffect(() => {
    if (session) {
      const fetchDataDetailAsset = async () => {
        try {
          const responseDetailAsset = await fetch(
            `/api/asset/GetDetailAsset?NoAsset=${noAsset}`,
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
            fetchDataDetailBranchCode(dataDetailAsset);

          } else {
            setDataAsset([]);
            //console.warn("Fetched data is not an array:", dataDetailAsset);
          }
        } catch (error) {
          console.error("Error fetching detail asset:", error);
        }
      };
      const fetchDataDetailBranchCode = async (dataDetailAsset) => {
        try {
          const responseDetailAsset = await fetch(
            `/api/asset/GetBranchCode?BranchCode=${dataDetailAsset.map((data) => (data.Cost_Ctr))}`,
            {
              method: "GET",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            }
          );
    
          const dataBranchCode = await responseDetailAsset.json();
          console.log(dataBranchCode)
    
          // Ensure dataDetailAsset is an array
          if (Array.isArray(dataBranchCode)) {
            setDataBranchCode(dataBranchCode);
          } else {
            setDataBranchCode([]);
            //console.warn("Fetched data is not an array:", dataDetailAsset);
          }
        } catch (error) {
          console.error("Error fetching detail asset:", error);
        }
      };
      fetchDataDetailAsset();
    }
  }, [session, noAsset, resultGroupBranch]);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusSlect(newStatus);
    if (newStatus !== "13") {
      setSelectedImage(null);
    } else if (newStatus !== "10"){
      setTextareaValue('');
    }
  };

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };

  return (
    <div className="background2">
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="absolute top-0 left-0 right-0 lg:h-56 md:h-48 sm:h-48 h-44 bg-blue-950 transform rounded-b-3xl">
          <a className="btn btn-ghost mt-5 ml-3 text-white" href="/home/CheckThePackage">
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
          {dataAsset ? (
            dataAsset.map((data) => (
              <div
                className="flex flex-col justify-center items-center mt-1"
                key={data.ID}
              >
                <a href="/home">
                <img
                  src="https://minio.saksiam.co.th/public/saktech/logo/LogoParcel.png"
                  className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 lg:-mt-16 md:-mt-16 sm:-mt-16 -mt-16"
                />
                </a>
                
                <div className="card bg-clip-border lg:w-2/5 md:w-3/5 sm:w-11/12 w-11/12 p-1 bg-base-100 shadow-xl flex flex-flex-col items-center justify-center h-20 text-center">
                  <h2 className="lg:text-2xl md:text-1xl sm:text-2xl text-2xl font-bold">
                    {data ? data.Asset_description : "Loading..."}
                  </h2>
                </div>

                <div className="mt-8"></div>

                <div className="container contents">
                  <div className="container flex items-center justify-center mb-2">
                    <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                      <div className="card-body">
                        <h2 className="text-center text-xl -mt-5">
                          รายละเอียด
                        </h2>

                        <div className="grid lg:gap-x-20 md:gap-x-20 sm:gap-x-20 gap-x-3 gap-y-10 lg:grid-cols-2 md:grid-cols-2 grid-cols-2 justify-center mt-5">
                          <div className="flex flex-col items-center">
                            <h2 className=" font-bold text-white mb-1">
                              Asset
                            </h2>
                            {data ? data.Asset : "Loading..."}
                          </div>

                          <div className="flex flex-col items-center text-center">
                            <h2 className="font-bold mb-1 text-wrap text-white">
                              ชื่อสินทรัพย์
                            </h2>
                            {data ? data.Asset_description : "Loading..."}
                          </div>

                          <div className="flex flex-col items-center">
                            <h2 className="font-bold text-white mb-1">
                              ประเภทพัสดุ
                            </h2>
                            {data ? data.Asset_class_description : "Loading..."}
                          </div>

                          <div className="flex flex-col items-center">
                            <h2 className="font-bold text-white mb-1">
                              สังกัด
                            </h2>
                            {dataBranchCode.map((item,index)=> item ? item.Name : "Loading..." )}
                            {/* {data ? data.Cost_Ctr : "Loading..."} */}
                          </div>

                          <div className="flex flex-col items-center">
                            <h2 className="font-bold text-white mb-1">สถานะ</h2>
                            <select
                              className="select select-bordered select-sm w-32 max-w-xs text-black"
                              defaultValue="รอตรวจนับ"
                              onChange={handleStatusChange}
                            >
                              <option value="รอตรวจนับ">รอตรวจนับ</option>
                              <option value={13}>ปกติ</option>
                              <option value={10}>โยกย้าย</option>
                              <option value={9}>อื่นๆ</option>
                            </select>
                          </div>
                        </div>

                        {statusselect === "13" && (
                          <div className="flex flex-col items-center justify-center mt-5">
                          {selectedImage && (
                            <img
                              src={selectedImage}
                              className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 rounded-md cursor-pointer"
                              alt="Uploaded"
                              onClick={() => (document.getElementById("pic") as HTMLDialogElement).showModal()}
                            />
                          )}

                          <label className="cursor-pointer flex flex-col items-center justify-center mt-5">
                            <img
                              src="https://minio.saksiam.co.th/public/saktech/logo/camera.png"
                              className="lg:h-48 md:h-24 sm:h-24 h-16 lg:w-48 md:w-24 sm:w-24 w-16"
                            />
                            <input
                              type="file"
                              onChange={handleImageUpload}
                              className="hidden"
                              accept="image/*"
                              capture="environment"
                            />
                          </label>

                          <div>
                            <dialog id="pic" className="modal">
                              <div className="modal-box bg-black bg-opacity-10">
                                <img
                                  src={selectedImage}
                                  className="max-h-screen max-w-screen"
                                  alt="Full Size"
                                />
                              </div>
                              <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                              </form>
                            </dialog>
                          </div>
                        </div>
                        )}

                        {statusselect === "10" && (
                          <div className="flex flex-col items-center justify-center mt-5">
                            <textarea 
                              className="textarea textarea-bordered w-full text-black" 
                              placeholder="กรอกรายละเอียด"
                              value={textareaValue}
                              onChange={handleTextareaChange}
                            >

                            </textarea>
                          </div>
                        )}



                      </div>
                    </div>
                  </div>

                  {(selectedImage || textareaValue) && (
                    <div className="flex items-center justify-center mt-2">
                      <button className="btn btn-primary bg-blue-950 text-white border-0 w-36 mr-3">ยืนยันการบันทึก</button>
                      <a className="btn btn-active btn-ghost text-blue-950 border-0 w-36" href="/home/CheckThePackage">ยกเลิก</a>
                    </div>
                  )}
                  
                </div>

                <footer className="footer footer-center p-4 text-base-content mt-10">
                  <aside>
                    <p>Copyright © 2024</p>
                  </aside>
                </footer>
              </div>
            ))
          ) : (
            <span className="loading loading-dots loading-lg text-blue-950"></span>
          )}
        </div>
      </div>
    </div>
  );
}
