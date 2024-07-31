"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";

export default function Page() {
  const { data: session, status } = useSession();
  const [resultGroupBranch, setResultGroupBranch] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [serialtValue, setSerialtValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");

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
    }
  }, [session]);

  useEffect(() => {
    if (session) {
    }
  }, [session, resultGroupBranch]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const TextChange = (event) => {
    setTextValue(event.target.value);
  };

  const SerialChange = (event) => {
    setSerialtValue(event.target.value);
  };

  const TextareaChange = (event) => {
    setTextareaValue(event.target.value);
    console.log(textareaValue)
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
        <div className="absolute top-0 left-0 right-0 lg:h-56 md:h-48 sm:h-48 h-44 bg-blue-950 transform rounded-b-3xl">
          <a
            className="btn btn-ghost mt-5 ml-3 text-white"
            href="/home/Checked"
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

          <div className="flex flex-col justify-center items-center mt-1">
            <a href="/home">
              <img
                src="https://minio.saksiam.co.th/public/saktech/logo/LogoParcel.png"
                className="lg:h-48 md:h-36 sm:h-24 h-32 lg:w-48 md:w-36 sm:w-24 w-32 lg:-mt-20 md:-mt-16 sm:-mt-16 -mt-16"
              />
            </a>

            <div className="card bg-clip-border lg:w-3/6 md:w-3/5 sm:w-11/12 w-11/12 p-1 bg-base-100 shadow-xl flex flex-flex-col items-center justify-center h-20 text-center">
              <h2 className="lg:text-4xl md:text-2xl sm:text-2xl text-2xl font-bold">
                ฟอร์มเพิ่มสินทรัพย์ที่ไม่มีเลข asset
              </h2>
            </div>

            <div className="mt-8"></div>

            <div className="flex flex-col items-center lg:w-3/5 md:w-3/5 sm:w-11/12 w-11/12">
              <div className="grid lg:gap-x-20 md:gap-x-10 sm:gap-x-1 gap-x-2 gap-y-4 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-3 grid-cols-1  mt-5 w-full">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-bold">ชื่อสินทรัพย์</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    value={textValue}
                    onChange={TextChange}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-bold">Serial Number <span className="text-red-600">( *ถ้ามี )</span></span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    value={serialtValue}
                    onChange={SerialChange}
                  />
                </label>
              </div>

              <label className="form-control w-full mt-5">
                <div className="label">
                  <span className="label-text font-bold">รายละเอียด</span>
                </div>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Type here"
                  value={textareaValue}
                    onChange={TextareaChange}
                ></textarea>
              </label>

              <div className="flex flex-col items-center justify-center mt-5">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 rounded-md cursor-pointer"
                    alt="Uploaded"
                    onClick={() =>
                      (
                        document.getElementById("pic") as HTMLDialogElement
                      ).showModal()
                    }
                  />
                )}

                <label className="cursor-pointer flex flex-col items-center justify-center mt-5">
                  <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/camera-bule.png"
                    className="lg:h-32 md:h-24 sm:h-24 h-16 lg:w-32 md:w-24 sm:w-24 w-16"
                  />
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                  />
                </label>

                {(selectedImage && textValue && textareaValue) && (
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
                        href="/home/FormNoAsset"
                      >
                        ยกเลิก
                      </a>
                    </div>
                  )}
              </div>
            </div>

            <footer className="footer footer-center p-4 text-base-content mt-32">
              <aside>
                <p>
                  {" "}
                  © 2024 COPYRIGHT BY SAKTECH VERSION{" "}
                  {process.env.NEXT_PUBLIC_VERSION}
                </p>
              </aside>
            </footer>
          </div>
        </div>

        <dialog id="pic" className="modal">
          <div className="modal-box bg-black bg-opacity-10">
            <img
              src={selectedImage}
              className="max-h-screen max-w-screen"
              alt="Image"
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}
