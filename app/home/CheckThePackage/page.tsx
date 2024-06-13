"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function PageContent() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const searchs = searchParams.get("asset") || "";
  const [search, setSearch] = useState(searchs);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg text-blue-950"></span>
      </div>
    );
  }

  return (
    <div className="background2">
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="absolute top-0 left-0 right-0 h-44 bg-blue-950 transform rounded-b-3xl">
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
              <path d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
            </svg>
          </a>
          <div className="flex flex-col justify-center items-center -mt-2">
            <h2 className="text-white lg:text-4xl text-2xl font-bold mb-4">
              ระบบตรวจนับพัสดุ
            </h2>
            <label className="input input-bordered flex items-center gap-2 lg:w-1/3 md:w-2/3 sm:w-4/5">
              <input
                type="text"
                className="grow"
                placeholder="ค้นหาข้อมูลพัสดุ....."
                value={search}
                onChange={handleChange}
              />
              <div className="flex justify-end -mr-5">
                <a className="btn btn-md btn-ghost" href="/home/ScanBarcode">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-upc-scan"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z" />
                  </svg>
                </a>
              </div>
            </label>

            <div className="mt-12"></div>
            <h1 className="mb-8 lg:text-3xl md:text-2xl text-3xl font-bold">
              รายการ
            </h1>
            <div className="container contents">
              <div className="container flex items-center justify-center mb-5">
                <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                  <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/12345.png"
                    className="lg:h-28 h-20 lg:w-28 w-20 m-4 lg:ml-5 ml-2"
                  />
                  <div className="flex flex-col lg:ml-5 ml-0">
                    <h1 className="lg:text-3xl md:text-1xl text-xl font-bold">
                      โปรเเกรม Microsoft Offic 365
                    </h1>
                    <h2 className="lg:text-lg md:text-lg text-sm mb-1">
                      32000000004125
                    </h2>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex lg:mr-10 md:mr-5 mr-4">
                    <button className="btn ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="container flex items-center justify-center mb-5">
                <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                  <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/12345.png"
                    className="lg:h-28 h-20 lg:w-28 w-20 m-4 lg:ml-5 ml-2"
                  />
                  <div className="flex flex-col lg:ml-5 ml-0">
                    <h1 className="lg:text-3xl md:text-1xl text-xl font-bold">
                      โปรเเกรม Microsoft Offic 365
                    </h1>
                    <h2 className="lg:text-lg md:text-lg text-sm mb-1">
                      32000000004125
                    </h2>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex lg:mr-10 md:mr-5 mr-4">
                    <button className="btn ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="container flex items-center justify-center mb-5">
                <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                  <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/12345.png"
                    className="lg:h-28 h-20 lg:w-28 w-20 m-4 lg:ml-5 ml-2"
                  />
                  <div className="flex flex-col lg:ml-5 ml-0">
                    <h1 className="lg:text-3xl md:text-1xl text-xl font-bold">
                      โปรเเกรม Microsoft Offic 365
                    </h1>
                    <h2 className="lg:text-lg md:text-lg text-sm mb-1">
                      32000000004125
                    </h2>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex lg:mr-10 md:mr-5 mr-4">
                    <button className="btn ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="container flex items-center justify-center mb-5">
                <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                  <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/12345.png"
                    className="lg:h-28 h-20 lg:w-28 w-20 m-4 lg:ml-5 ml-2"
                  />
                  <div className="flex flex-col lg:ml-5 ml-0">
                    <h1 className="lg:text-3xl md:text-1xl text-xl font-bold">
                      โปรเเกรม Microsoft Offic 365
                    </h1>
                    <h2 className="lg:text-lg md:text-lg text-sm mb-1">
                      32000000004125
                    </h2>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex lg:mr-10 md:mr-5 mr-4">
                    <button className="btn ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="container flex items-center justify-center mb-5">
                <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                  <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/12345.png"
                    className="lg:h-28 h-20 lg:w-28 w-20 m-4 lg:ml-5 ml-2"
                  />
                  <div className="flex flex-col lg:ml-5 ml-0">
                    <h1 className="lg:text-3xl md:text-1xl text-xl font-bold">
                      โปรเเกรม Microsoft Offic 365
                    </h1>
                    <h2 className="lg:text-lg md:text-lg text-sm mb-1">
                      32000000004125
                    </h2>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex lg:mr-10 md:mr-5 mr-4">
                    <button className="btn ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-28"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-dots loading-lg text-blue-950"></span>
        </div>
      }
    >
      {isClient && <PageContent />}
    </Suspense>
  );
}
