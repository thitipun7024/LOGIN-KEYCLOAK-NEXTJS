"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";
import Image from "next/image";
import asset_log from "../../../../function/asset_log";

export default function Page() {
  const { data: session, status } = useSession();
  const [noAsset, setNoAsset] = useState<string[]>([]);
  const [dataAsset, setDataAsset] = useState([]);
  const [resultGroupBranch, setResultGroupBranch] = useState(null);
  const [dataBranchCode, setDataBranchCode] = useState([]);
  const [dataFileImage, setDataFileImage] = useState([{fileUpload:'2024/08/LoadingImage.png'}]);
  const [urlImage, setUrlImage] = useState("");
  const [usedecoded, setUseDecoded] = useState<Token | null>(null);

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
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      const fetchDataDetailAsset = async () => {
        try {
          const responseDetailAsset = await fetch(
            `/api/asset/GetDetailAssetChecked?NoAsset=${noAsset}`,
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
  }, [session, noAsset, resultGroupBranch]);

  useEffect(() => {
    if (dataAsset.length > 0) {
      const fetchfileImage = async () => {
        try {
          const fileIds = dataAsset.map((id) => id.fileId).join(",");
          const responseFileImage = await fetch(
            `/api/asset/GetFile?fileId=${fileIds}`,
            {
              method: "GET",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            }
          );

          const dataFileImage = await responseFileImage.json();

          if (Array.isArray(dataFileImage)) {
            setDataFileImage(dataFileImage);
          } else {
            setDataFileImage([]);
          }
        } catch (error) {
          console.error("Error fetching file image:", error);
        }
      };

      fetchfileImage();
    }
  }, [dataAsset]);


  useEffect(() => {
    if (session) {
      const fetchUrlImage = async () => {
        try {
          const responseFileImage = await fetch(
            `/api/asset/GetImageURL`,
            {
              method: "POST",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            }
          );

          const dataFileImage = await responseFileImage.json();
          
          if (dataFileImage !== null || dataFileImage !== '') {
            setUrlImage(dataFileImage.uri);
          } else {
            setUrlImage('');
          }
        } catch (error) {
          console.error("Error fetching file image:", error);
        }
      };

      fetchUrlImage();
    }
  }, [session]);

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

  const ClickBackPage = async () => {
    try {
      await asset_log(usedecoded.username, resultGroupBranch, "ปุ่มย้อนกลับ", "ปุ่มย้อนกลับไปสู่หน้ารายการสินทรัพย์ที่ถูกครวจนับเเล้ว", "", "", "");
      window.location.href = "/home/Checked";
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
                </a>

                <div className="card bg-clip-border lg:w-2/5 md:w-3/5 sm:w-11/12 w-11/12 p-1 bg-base-100 shadow-xl flex flex-flex-col items-center justify-center h-20 text-center">
                  <h2 className="lg:text-4xl md:text-2xl sm:text-2xl text-xl font-bold">
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

                            {data.Status === "1" && (
                              <div className="lg:text-xl md:text-lg sm:text-md text-md badge badge-lg w-20">
                                ปกติ
                              </div>
                            )}
                            {data.Status === "7" && (
                              <div className="lg:text-lg md:text-md sm:text-md text-md badge badge-lg lg:w-28 md:w-20 sm:w-20 w-20">
                                โยกย้าย
                              </div>
                            )}
                            {data.Status === "14" && (
                              <div className="lg:text-xl md:text-lg sm:text-md text-md badge badge-lg w-20">
                                อื่นๆ
                              </div>
                            )}
                          </div>
                        </div>

                        {data.Status === "1" && (
                          <div className="flex flex-col items-center justify-center mt-10">
                            <div className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 rounded-md cursor-pointer">
                              <Image
                                src={`${urlImage}${dataFileImage.map(
                                  (file) => file.fileUpload
                                )}`}
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
                          </div>
                        )}

                        {data.Status === "7" && (
                          <div className="flex flex-col items-center justify-center mt-10">
                            <textarea
                              className="textarea textarea-bordered lg:w-4/6 md:w-4/5 sm:w-4/5 w-full text-black lg:text-base md:text-base sm:text-baseb"
                              placeholder="กรอกรายละเอียด"
                              defaultValue={data.Description}
                              style={{ color: "black" }}
                              disabled
                            ></textarea>
                          </div>
                        )}

                        {data.Status === "14" && (
                          <div>
                            <div className="flex flex-col items-center justify-center mt-10">
                              <div className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 rounded-md cursor-pointer">
                                <Image
                                 src={`${urlImage}${dataFileImage.map(
                                  (file) => file.fileUpload
                                )}`}
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

                              <div></div>
                            </div>

                            <div className="flex flex-col items-center justify-center mt-10">
                              <textarea
                                className="textarea textarea-bordered lg:w-4/6 md:w-4/5 sm:w-4/5 w-full text-black lg:text-base md:text-base sm:text-baseb"
                                placeholder="กรอกรายละเอียด"
                                defaultValue={data.Description}
                                style={{ color: "black" }}
                                disabled
                              ></textarea>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="footer footer-center p-4 text-base-content lg:mt-28 md:mt-20 sm:mt-32 mt-12">
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

        <div>
          <dialog id="pic" className="modal">
            <div className="modal-box bg-black bg-opacity-10">
              <div className="max-h-screen max-w-screen">
                <Image
                   src={`${urlImage}${dataFileImage.map(
                    (file) => file.fileUpload
                  )}`}
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
    </div>
  );
}
