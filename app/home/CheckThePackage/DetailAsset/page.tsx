"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";

export default function Page() {
  const { data: session, status } = useSession();
  const [noAsset, setNoAsset] = useState<string[]>([]);
  const [sakHQ, setSakHQ] = useState(null);
  const [groupBaD_TH, setGroupBaD_TH] = useState(null);
  const [dataAsset, setDataAsset] = useState([]);
  const [resultGroupBranch, setResultGroupBranch] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [statusselect, setStatusSlect] = useState("รอตรวจนับ");
  const [textareaValue, setTextareaValue] = useState("");
  const [dataBranchCode, setDataBranchCode] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalShown, setModalShown] = useState(false);
  const [selectedValue, setSelectedValue] = useState("รอตรวจนับ");

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

      const findGroupBranch = decoded.groups.find((group) => {
        return group.includes("/group/SAK BRANCH/");
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
      setGroupBaD_TH(resultGroupBaD_TH);
    }
  }, [session]);

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

          if (Array.isArray(dataDetailAsset)) {
            setDataAsset(dataDetailAsset);
            fetchDataDetailBranchCode(dataDetailAsset);
          } else {
            setDataAsset([]);
            window.location.href = "/home";
          }
        } catch (error) {
          console.error("Error fetching detail asset:", error);
        }
      };

      const fetchDataDetailBranchCode = async (dataDetailAsset) => {
        try {
          const responseDetailAsset = await fetch(
            `/api/asset/GetBranchCode?BranchCode=${dataDetailAsset.map(
              (data) => data.Cost_Ctr
            )}`,
            {
              method: "GET",
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
        } catch (error) {
          console.error("Error fetching detail asset:", error);
        }
      };
      fetchDataDetailAsset();
    }

    const fetchDataSakHQ = async () => {
      try {
        const responseSakHQ = await fetch(
          `/api/asset/GetNoSakHQ?SakHQ=${groupBaD_TH}`,
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
        }
      } catch (error) {
        console.error("Error fetching SakHQ data:", error);
      }
    };
    fetchDataSakHQ();
  }, [session, noAsset, resultGroupBranch, groupBaD_TH]);

  useEffect(() => {
    if (dataBranchCode.length > 0 && !modalShown) {
      const branchCode = dataBranchCode.map((item) => item.CostCenter);
      const groupBranch = sakHQ ? sakHQ : resultGroupBranch;

      const match = branchCode.includes(groupBranch);

      if (!match) {
        setIsModalOpen(true);
        setModalShown(true);
        setSelectedValue("14");
        setStatusSlect("14");
      }
    }
  }, [dataBranchCode, resultGroupBranch, sakHQ, modalShown]);

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
    }
    if (newStatus !== "10") {
      setTextareaValue("");
    }
  };

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  // console.log(resultGroupBranch)


  return (
    <div className="background2">
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="absolute top-0 left-0 right-0 lg:h-56 md:h-48 sm:h-48 h-44 bg-blue-950 transform rounded-b-3xl">
          <a
            className="btn btn-ghost mt-5 ml-3 text-white"
            href="/home/CheckThePackage"
          >
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
                    className="lg:h-48 md:h-36 sm:h-24 h-32 lg:w-48 md:w-36 sm:w-24 w-32 lg:-mt-20 md:-mt-16 sm:-mt-16 -mt-16"
                  />
                </a>

                <div className="card bg-clip-border lg:w-2/5 md:w-3/5 sm:w-11/12 w-11/12 p-1 bg-base-100 shadow-xl flex flex-flex-col items-center justify-center h-20 text-center">
                  <h2 className="lg:text-4xl md:text-2xl sm:text-2xl text-2xl font-bold">
                    {data ? (
                      data.Asset_description
                    ) : (
                      <span className="loading loading-dots loading-md"></span>
                    )}
                  </h2>
                </div>

                <div className="mt-8"></div>

                <div className="container contents">
                  <div className="container flex items-center justify-center mb-2">
                    <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                      <div className="card-body">
                        <h2 className="text-center lg:text-4xl md:text-3xl sm:text-xl text-2xl -mt-5 text-yellow-400 font-bold">
                          รายละเอียด
                        </h2>
                        <hr className="border-t-2 border-yellow-400 mt-2" />

                        <div className="grid lg:gap-x-20 md:gap-x-20 sm:gap-x-20 gap-x-3 gap-y-10 lg:grid-cols-2 md:grid-cols-2 grid-cols-2 justify-center mt-5">
                          <div className="flex flex-col items-center">
                            <h2 className=" font-bold text-white mb-1 lg:text-xl md:text-2xl sm:text-md text-lg">
                              Asset
                            </h2>
                            <p className="lg:text-xl md:text-lg sm:text-md text-md text-white">
                              {data ? (
                                data.Asset
                              ) : (
                                <span className="loading loading-dots loading-md"></span>
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col items-center text-center">
                            <h2 className=" font-bold text-white mb-1 lg:text-xl md:text-2xl sm:text-md text-lg">
                              ชื่อสินทรัพย์
                            </h2>
                            <p className="lg:text-xl md:text-lg sm:text-md text-md text-white">
                              {data ? (
                                data.Asset_description
                              ) : (
                                <span className="loading loading-dots loading-md"></span>
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col items-center">
                            <h2 className=" font-bold text-white mb-1 lg:text-xl md:text-2xl sm:text-md text-lg">
                              ประเภทพัสดุ
                            </h2>
                            <p className="lg:text-xl md:text-lg sm:text-md text-md text-white">
                              {data ? (
                                data.Asset_class_description
                              ) : (
                                <span className="loading loading-dots loading-md"></span>
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col items-center">
                            <h2 className=" font-bold text-white mb-1 lg:text-xl md:text-2xl sm:text-md text-lg">
                              สังกัด
                            </h2>
                            <p className="lg:text-xl md:text-lg sm:text-md text-md text-white">
                              {dataBranchCode.map((item) =>
                                item ? (
                                  item.Name
                                ) : (
                                  <span className="loading loading-dots loading-md" key={item
                                  .CostCenter}></span>
                                )
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col items-center">
                            <h2 className=" font-bold text-white mb-1 lg:text-xl md:text-2xl sm:text-md text-lg">
                              สถานะ
                            </h2>
                            <select
                              className="select select-bordered lg:select-sm md:select-md sm:select-sm select-sm lg:w-28 md:w-32 sm:w-28 w-28 max-w-xs text-black"
                              defaultValue="รอตรวจนับ"
                              value={selectedValue}
                              onChange={(e) => {
                                setSelectedValue(e.target.value);
                                handleStatusChange(e);
                              }}
                            >
                              <option value="รอตรวจนับ">รอตรวจนับ</option>
                              <option value="1">ปกติ</option>
                              <option value="7">โยกย้าย</option>
                              <option value="14">อื่นๆ</option>
                            </select>
                          </div>
                        </div>

                        {statusselect === "1" && (
                          <div className="flex flex-col items-center justify-center mt-5">
                            {selectedImage && (
                              <img
                                src={selectedImage}
                                className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 rounded-md cursor-pointer"
                                alt="Uploaded"
                                onClick={() =>
                                  (
                                    document.getElementById(
                                      "pic"
                                    ) as HTMLDialogElement
                                  ).showModal()
                                }
                              />
                            )}

                            <label className="cursor-pointer flex flex-col items-center justify-center mt-5">
                              <img
                                src="https://minio.saksiam.co.th/public/saktech/logo/camera.png"
                                className="lg:h-36 md:h-24 sm:h-24 h-16 lg:w-36 md:w-24 sm:w-24 w-16"
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
                                <form
                                  method="dialog"
                                  className="modal-backdrop"
                                >
                                  <button>close</button>
                                </form>
                              </dialog>
                            </div>
                          </div>
                        )}

                        {statusselect === "7" && (
                          <div className="flex flex-col items-center justify-center mt-5">
                            <textarea
                              className="textarea textarea-bordered lg:w-4/6 md:w-4/5 sm:w-4/5 w-full text-black lg:text-base md:text-base sm:text-baseb"
                              placeholder="กรอกรายละเอียด"
                              value={textareaValue}
                              onChange={handleTextareaChange}
                            ></textarea>
                          </div>
                        )}

                        {statusselect === "14" && (
                          <div>
                            <div className="flex flex-col items-center justify-center mt-5">
                              {selectedImage && (
                                <img
                                  src={selectedImage}
                                  className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 rounded-md cursor-pointer"
                                  alt="Uploaded"
                                  onClick={() =>
                                    (
                                      document.getElementById(
                                        "pic"
                                      ) as HTMLDialogElement
                                    ).showModal()
                                  }
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
                            </div>

                            <div className="flex flex-col items-center justify-center mt-5">
                              <textarea
                                className="textarea textarea-bordered w-full text-black"
                                placeholder="กรอกรายละเอียด"
                                value={textareaValue}
                                onChange={handleTextareaChange}
                              ></textarea>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {(selectedImage || textareaValue) && (
                    <div className="flex items-center justify-center mt-2">
                      <button
                        className="btn btn-primary bg-blue-950 text-white border-0 w-36 mr-3"
                        onClick={() =>
                          (
                            document.getElementById(
                              "confirm"
                            ) as HTMLDialogElement
                          ).showModal()
                        }
                      >
                        ยืนยันการบันทึก
                      </button>
                      <a
                        className="btn btn-active btn-ghost text-blue-950 border-0 w-36"
                        href="/home/CheckThePackage"
                      >
                        ยกเลิก
                      </a>
                    </div>
                  )}
                </div>

                <footer className="footer footer-center p-4 text-base-content mt-10">
                  <aside>
                    <p> © 2024 COPYRIGHT BY SAKTECH VERSION {process.env.NEXT_PUBLIC_VERSION}</p>
                  </aside>
                </footer>
              </div>
            ))
          ) : (
            <span className="loading loading-dots loading-lg text-blue-950"></span>
          )}
        </div>

        <dialog id="confirm" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-xl text-blue-950">
              ยืนยันการตวจสินทรัพย์ !
            </h3>
            <p className="py-5 mt-3 lg:text-lg md:text-lg sm:text-base text-base text-blue-950 flex items-center justify-center">
              คุณยืนยันที่จะส่งการตรวจสินทรัพย์ใช่ไหม
            </p>
            <div className="modal-action flex items-center">
              <form method="dialog" className="flex items-center">
                <a
                  className="btn mr-2 bg-blue-950 text-white"
                  href="../../../Success"
                >
                  ยืนยัน
                </a>
                <button className="btn">ยกเลิก</button>
              </form>
            </div>
          </div>
        </dialog>

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

        {isModalOpen && (
          <dialog open className="modal">
            <div className="modal-box">
              <div className="flex justify-center items-center">
                <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/warning.png"
                    className="lg:h-48 md:h-36 sm:h-24 h-20 lg:w-48 md:w-20 sm:w-24 w-20"
                  />
              </div>
              <p className="py-4 flex text-center font-bold">
                สินทรัพย์นี้ไม่ใช่สินทรัพย์ที่อยู่ในสาขาของท่านกรุณาตวจสอบสินทรัพย์นี้
              </p>
              <div className="modal-action">
                <button className="btn" onClick={closeModal}>
                  ปิด
                </button>
              </div>
            </div>
          </dialog>
        )}
        
      </div>
    </div>
  );
}

