"use client";
import React, { useEffect, useState } from "react";
import asset_log from "../../../../function/asset_log";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";
import Image from "next/image";

export default function Page() {
  const { data: session, status } = useSession();
  const [noAsset, setNoAsset] = useState(null);
  const [dataAsset, setDataAsset] = useState([]);
  const [resultGroupBranch, setResultGroupBranch] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [statusselect, setStatusSlect] = useState("รอตรวจนับ");
  const [textareaValue, setTextareaValue] = useState("");
  const [dataBranchCode, setDataBranchCode] = useState([]);
  const [username, setusername] = useState<string>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalShown, setModalShown] = useState(false);
  const [selectedValue, setSelectedValue] = useState("รอตรวจนับ");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [modalAssetChecked, setModalAssetChecked] = useState(false);
  const [sakHQ, setSakHQ] = useState(null);
  const [groupBaD_TH, setGroupBaD_TH] = useState(null);
  const [other, setOther] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usedecoded, setUseDecoded] = useState<Token | null>(null);
  const [dataBranch, setBataBranch] = useState(null);

  const InsertTrackingData = async () => {
    setIsLoading(true);
    let statusToSend = statusselect;
    if (statusselect === "1") {
      statusToSend = "ปกติ";
    } else if (statusselect === "7") {
      statusToSend = "โยกย้าย";
    } else {
      statusToSend = "อื่นๆ";
    }

    const dataAssetNoBranch: any = dataAsset.map((item) => item.Cost_Ctr);
    try {
      await asset_log(
        usedecoded?.username || "unknown",
        resultGroupBranch,
        "ยืนยัน",
        "ยืนยันการส่งการตรวจนับสินทรัพย์",
        statusToSend,
        noAsset,
        dataAssetNoBranch
      );

      if (statusselect === "1" || statusselect === "14") {
        const fileInput = document.getElementById(
          "fileInput"
        ) as HTMLInputElement;
        const files = fileInput.files?.[0];
        const fileToSend = files ? files : "";

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "multipart/form-data");
        const formdata = new FormData();

        let uploadResult = "";


        if (files) {
          formdata.append("file", fileToSend);
          formdata.append("username", username);
      
          try {
            const uploadResponse = await fetch(`/api/asset/InsertFileMinio`, {
              method: "POST",
              body: formdata,
            });
            uploadResult = await uploadResponse.json();
          } catch (error) {
            console.log("File upload failed:", error);
            window.location.href = "../../../NoSuccess";
            return;
          }
        } else {
          console.log("ไม่มีไฟล์ที่ถูกเลือก");
        }

        try {
          const response = await fetch(
            `/api/asset/InsertTrackingData?AssetCode=${noAsset}&Status=${statusselect}&Branch=${dataBranchCode.map(
              (item) => item.CostCenter
            )}&Comment=${textareaValue}&CreateBy=${username}&fileupload=${uploadResult}&Description=${textareaValue}`,
            {
              method: "POST",
            }
          );
          const result = await response.json();
          console.log(result);

          if (response.status === 200) {
            window.location.href = "../../../Success";
          } else {
            window.location.href = "../../../NoSuccess";
          }
        } catch (error) {
          console.log(error);
          window.location.href = "../../../NoSuccess";
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const response = await fetch(
            `/api/asset/InsertTrackingData?AssetCode=${noAsset}&Status=${statusselect}&Branch=${dataBranchCode.map(
              (item) => item.CostCenter
            )}&Comment=${textareaValue}&CreateBy=${username}&fileupload=${null}&Description=${textareaValue}`,
            {
              method: "POST",
            }
          );

          const result = await response.json();
          console.log(result);

          if (response.status === 200) {
            window.location.href = "../../../Success";
          } else {
            window.location.href = "../../../NoSuccess";
          }
        } catch (error) {
          console.log(error);
          window.location.href = "../../../NoSuccess";
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error ModalChecked action:", error);
    }
  };

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
      setUseDecoded(decoded);
      const findDisplayname: any = decoded.username;

      setusername(findDisplayname);

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
        <div className="badge badge-error badge-outline">ไม่มีข้อมูล</div>
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
            const hasStatus = dataDetailAsset.some(
              (item) => item.Status === "16"
            );
            if (hasStatus) {
              setDataAsset(dataDetailAsset);
              fetchDataDetailBranchCode(dataDetailAsset);
              setBataBranch(dataAsset.map((branch) => branch.Cost_Ctr));
            } else {
              setModalAssetChecked(true);
              setBataBranch(dataDetailAsset);
            }
          } else {
            setDataAsset([]);
            setShowWarningModal(true);
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
          //console.log(dataBranchCode);

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
        setOther(true);
      }
    }
  }, [dataBranchCode, resultGroupBranch, sakHQ, modalShown]);

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
      const objectURL = URL.createObjectURL(file);
      setSelectedImage(objectURL);
    } else {
      console.error("No file selected");
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

  const closeCancel = async () => {
    const dataAssetNoBranch: any = dataAsset.map((item) => item.Cost_Ctr);
    try {
      await asset_log(
        usedecoded?.username || "unknown",
        resultGroupBranch,
        "ยกเลิก",
        "ยกเลิกการส่งการตรวจนับสินทรัพย์",
        "",
        noAsset,
        dataAssetNoBranch
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error ModalChecked action:", error);
    }
  };

  const closeModal = async () => {
    const dataAssetNoBranch: any = dataAsset.map((item) => item.Cost_Ctr);
    try {
      await asset_log(
        usedecoded?.username || "unknown",
        resultGroupBranch,
        "Modal",
        "สินทรัพย์ที่ไม่ใช่สินทรัพของสังกัดที่ตรวจนับ",
        "",
        noAsset,
        dataAssetNoBranch
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error ModalChecked action:", error);
    }
  };

  const closeWarningModal = async () => {
    try {
      await asset_log(
        usedecoded?.username || "unknown",
        resultGroupBranch,
        "Modal",
        "สินทรัพย์ที่ไม่มีอยู่ในระบบ",
        "",
        noAsset,
        ""
      );
      setShowWarningModal(false);
      window.location.href = "/home/CheckThePackage";
    } catch (error) {
      console.error("Error ModalWarning action:", error);
    }
  };

  const closeModalAssetChecked = async () => {
    const dataBranchAsset = dataBranch.map((branch) => branch.Cost_Ctr);
    try {
      await asset_log(
        usedecoded?.username || "unknown",
        resultGroupBranch,
        "Modal",
        "สินทรัพย์ที่ถูกตรวจนับเเล้ว",
        "",
        noAsset,
        dataBranchAsset
      );
      setModalAssetChecked(false);
      window.location.href = "/home/CheckThePackage";
    } catch (error) {
      console.error("Error ModalChecked action:", error);
    }
  };

  const ClickBackPage = async () => {
    try {
      await asset_log(usedecoded.username, resultGroupBranch, "ปุ่มย้อนกลับ", "ปุ่มย้อนกลับไปสู่หน้ารายการสินทรัพย์ที่ยังไม่ถูกตรวจนับ", "", "", "");
      window.location.href = "/home/CheckThePackage";
    } catch (error) {
      console.error("Error action:", error);
    }
  };

  const ClickLogoBackPage = async () => {
    try {
      await asset_log(usedecoded.username, resultGroupBranch, 'Logo', 'Logo ย้อนกลับหน้าเเรก','', '', '');
      window.location.href = "/home";
    } catch (error) {
      console.error("Error action:", error);
    }
  };

  return (
    <div className="background2">
      {!modalAssetChecked && !showWarningModal && (
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="absolute top-0 left-0 right-0 lg:h-52 md:h-52 sm:h-48 h-44 bg-blue-950 transform rounded-b-3xl">
            <a
              className="btn btn-ghost mt-5 ml-3 text-white"
              onClick={ClickBackPage}
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
                  <a onClick={ClickLogoBackPage}>
                    <div className="lg:h-32 md:h-32 sm:h-24 h-20 lg:w-48 md:w-48 sm:w-24 w-36 lg:-mt-12 md:-mt-12 sm:-mt-16 -mt-12 mb-5">
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
                            รายละเอียดสินทรัพย์
                          </h2>
                          <hr className="border-t-2 border-yellow-400 mt-2" />

                          <div className="grid lg:gap-x-20 md:gap-x-20 sm:gap-x-20 gap-x-3 gap-y-10 lg:grid-cols-2 md:grid-cols-2 grid-cols-2 justify-center mt-5">
                            <div className="flex flex-col items-center">
                              <h2 className=" font-bold text-white mb-1 lg:text-xl md:text-2xl sm:text-md text-lg">
                                เลขที่สินทรัพย์
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
                                ประเภทสินทรัพย์
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
                                    <span
                                      className="loading loading-dots loading-md"
                                      key={item.CostCenter}
                                    ></span>
                                  )
                                )}
                              </p>
                            </div>

                            <div className="flex flex-col items-center">
                              <h2 className=" font-bold text-white mb-1 lg:text-xl md:text-2xl sm:text-md text-lg">
                                สถานะ
                              </h2>
                              {other ? (
                                <select
                                  className="select select-bordered lg:select-sm md:select-md sm:select-sm select-sm lg:w-28 md:w-32 sm:w-28 w-28 max-w-xs text-black"
                                  value={selectedValue}
                                  onChange={(e) => {
                                    setSelectedValue(e.target.value);
                                    handleStatusChange(e);
                                  }}
                                  disabled
                                >
                                  <option value="14">อื่นๆ</option>
                                </select>
                              ) : (
                                <select
                                  className="select select-bordered lg:select-sm md:select-md sm:select-sm select-sm lg:w-28 md:w-32 sm:w-28 w-28 max-w-xs text-black"
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
                              )}
                            </div>
                          </div>

                          {statusselect === "1" && (
                            <div className="flex flex-col items-center justify-center mt-5">
                              {selectedImage && (
                                <div className="lg:h-48 md:h-32 sm:h-24 h-32 lg:w-48 md:w-32 sm:w-24 w-32 rounded-lg cursor-pointer">
                                  <Image
                                    src={
                                      selectedImage ||
                                      "https://minio.saksiam.co.th/public/saktech/logo/LOGO-ASSET-V2.png"
                                    }
                                    alt="Uploaded"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                    }}
                                    width={1200}
                                    height={0}
                                    priority
                                    onClick={() =>
                                      (
                                        document.getElementById(
                                          "pic"
                                        ) as HTMLDialogElement
                                      ).showModal()
                                    }
                                  />
                                </div>
                              )}

                              <label className="cursor-pointer flex flex-col items-center justify-center mt-5">
                                <div className="lg:h-36 md:h-24 sm:h-24 h-16 lg:w-36 md:w-24 sm:w-24 w-16">
                                  <Image
                                    src="https://minio.saksiam.co.th/public/saktech/logo/camera.png"
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
                                <input
                                  type="file"
                                  id="fileInput"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  accept="image/*"
                                  capture="environment"
                                />
                              </label>
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
                                  <div className="lg:h-48 md:h-32 sm:h-24 h-32 lg:w-48 md:w-32 sm:w-24 w-32 rounded-lg cursor-pointer">
                                    <Image
                                      src={selectedImage}
                                      alt="Uploaded"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                      }}
                                      width={1200}
                                      height={0}
                                      priority
                                      onClick={() =>
                                        (
                                          document.getElementById(
                                            "pic"
                                          ) as HTMLDialogElement
                                        ).showModal()
                                      }
                                    />
                                  </div>
                                )}

                                <label className="cursor-pointer flex flex-col items-center justify-center mt-5">
                                  <div className="lg:h-36 md:h-24 sm:h-24 h-16 lg:w-36 md:w-24 sm:w-24 w-16">
                                    <Image
                                      src="https://minio.saksiam.co.th/public/saktech/logo/camera.png"
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
                                  <input
                                    type="file"
                                    id="fileInput"
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
                          onClick={closeCancel}
                        >
                          ยกเลิก
                        </a>
                      </div>
                    )}
                  </div>

                  <footer className="footer footer-center p-4 text-base-content lg:mt-28 md:mt-80 sm:mt-32 mt-12">
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
              ))
            ) : (
              <span className="loading loading-dots loading-lg text-blue-950"></span>
            )}
          </div>

          <dialog id="confirm" className="modal">
            <div className="modal-box flex justify-center items-center">
              {isLoading ? (
                <span className="loading loading-dots loading-lg text-blue-950"></span>
              ) : (
                <div>
                  <h3 className="font-bold text-xl text-blue-950">
                    ยืนยันการตรวจสินทรัพย์ !
                  </h3>
                  <p className="py-5 mt-3 lg:text-lg md:text-lg sm:text-base text-base text-blue-950 flex items-center justify-center">
                    คุณยืนยันที่จะส่งการตรวจสินทรัพย์ใช่หรือไม่
                  </p>
                  <div className="modal-action flex items-center">
                    <form method="dialog" className="flex items-end lg:-mr-16 md:-mr-16 sm:-mr-3 -mr-3">
                      <a
                        className="btn mr-2 bg-blue-950 text-white"
                        onClick={() => InsertTrackingData()}
                      >
                        ยืนยัน
                      </a>
                      <button className="btn" onClick={closeCancel}>
                        ยกเลิก
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </dialog>

          <div>
            <dialog id="pic" className="modal">
              <div className="modal-box bg-black bg-opacity-10">
                <div className="max-h-screen max-w-scree">
                  <Image
                    src={
                      selectedImage ||
                      "https://minio.saksiam.co.th/public/saktech/logo/LOGO-ASSET-V2.png"
                    }
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
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        </div>
      )}

      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <div className="flex justify-center items-center">
              <div className="lg:h-48 md:h-20 sm:h-24 h-20 lg:w-48 md:w-20 sm:w-24 w-20">
                <Image
                  src="https://minio.saksiam.co.th/public/saktech/logo/question.png"
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
            </div>
            <p className="py-4 flex justify-center text-center font-bold break-words lg:w-11/12 md:w-8/12 sm:w-8/12 w-11/12 mx-auto">
              สินทรัพย์รายการนี้ไม่ได้อยู่ในสังกัดของท่าน กรุณาตรวจสอบ
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                ปิด
              </button>
            </div>
          </div>
        </dialog>
      )}

      {showWarningModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <div className="flex justify-center items-center">
              <div className="lg:h-48 md:h-20 sm:h-24 h-20 lg:w-48 md:w-20 sm:w-24 w-20">
                <Image
                  src="https://minio.saksiam.co.th/public/saktech/logo/cross.png"
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
            </div>
            <p className="py-4 flex text-center justify-center font-bold lg:text-lg md:text-lg sm:text-lg text-lg">
              ไม่มีสิทรัพย์นี้อยู่ในระบบ
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeWarningModal}>
                ปิด
              </button>
            </div>
          </div>
        </dialog>
      )}

      {modalAssetChecked && (
        <dialog open className="modal">
          <div className="modal-box">
            <div className="flex justify-center items-center">
              <div className="lg:h-48 md:h-20 sm:h-24 h-20 lg:w-48 md:w-20 sm:w-24 w-20">
                <Image
                  src="https://minio.saksiam.co.th/public/saktech/logo/warning.png"
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
            </div>
            <p className="py-4 flex text-center justify-center font-bold lg:text-lg md:text-lg sm:text-lg text-lg">
              สินทรัพย์นี้ถูกตรวจนับไปเเล้ว
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeModalAssetChecked}>
                ปิด
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}