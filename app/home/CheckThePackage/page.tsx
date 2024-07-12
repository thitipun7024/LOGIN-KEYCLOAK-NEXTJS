"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";

function PageContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const searchs = searchParams.get("asset") || "";
  const [search, setSearch] = useState(searchs);
  const [rows, setRows] = useState([]);
  const [sakHQ, setSakHQ] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [countNochecked, setCountNoChecked] = useState(null);
  const [resultGroupBranchNo, setResultGroupBranch] = useState(null)
  const [count, setCount] = useState([]);
  const itemsPerPage = 10;

  //console.log(resultGroupBranchNo)

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (session) {
      const decoded = jwtDecode<Token>(session.accessToken);

      const findGroupBranch = decoded.groups.find((group) => {
        return (
          group.includes("/group/SAK BRANCH/") || group.includes("/group/SAK HQ/")
        );
      });
      const resultGroupBranch = findGroupBranch
        ? findGroupBranch.split("/").pop()
        : "primary";
        setResultGroupBranch(resultGroupBranch);

      const findGroupBaD_TH = decoded.groups.find((group) => {
        return group.includes("/group/SAK BRANCH_TH/") || group.includes("/group/SAK DEPARTMENT-TH/");
      });
      const resultGroupBaD_TH = findGroupBaD_TH
        ? findGroupBaD_TH.split("/").pop()
        : <div className="badge badge-sm badge-error badge-outline">ไม่มีข้อมูลชื่อสาขา/หน่วย</div>;

      const fetchDataSakHQ = async () => {
        try {
          setIsLoading(true);
          const responseSakHQ = await fetch(`/api/asset/GetNoSakHQ?SakHQ=${resultGroupBaD_TH}`, {
            method: "GET",
            redirect: "follow",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          });
          const SakHQJson = await responseSakHQ.json();
          const costCenter = SakHQJson.CostCenter;
          setSakHQ(costCenter);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDataSakHQ();

      const fetchData = async () => {
        try {
          setIsLoading(true);
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
          setRows(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();

          //Function
          const fetchDataCountNochecked = async () => {
            try {
              const responseNoasset = await fetch(`/api/asset/CountDataStatusNoCheck?resultGroupBranch=${resultGroupBranch}&SakHQ=${sakHQ}`, {
                method: "GET",
                redirect: "follow",
                headers: {
                  "Cache-Control": "no-cache",
                  Pragma: "no-cache",
                },
              });
              const { countAssetNoChecked } = await responseNoasset.json();
              //console.log(countAssetNoChecked);
              setCountNoChecked(countAssetNoChecked);
            } catch (error) {
              console.log(error);
            }
          };
          fetchDataCountNochecked();
          //Function

          //Function
          const fetchDataCount = async () => {
            try {
              const response = await fetch(`/api/asset/CountDataAsset?resultGroupBranch=${resultGroupBranch}&SakHQ=${sakHQ}`, {
                method: "GET",
                redirect: "follow",
                headers: {
                  "Cache-Control": "no-cache",
                  Pragma: "no-cache",
                },
              });
              const { count } = await response.json();
              //console.log(count);
              setCount(count);
            } catch (error) {
              console.log(error);
            }
          };
          fetchDataCount();
          //Function
    }
  }, [session, sakHQ, resultGroupBranchNo]);

    //Function 
    const ClickDetailAsset = async (row) => { 
      sessionStorage.setItem('NoAsset', row.Asset);
      window.location.href = `/home/CheckThePackage/DetailAsset`;
    };
    //Function

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on search change
  }, [search]);

  const filterData = () => {
    if (!Array.isArray(rows)) return [];
    return rows.filter(row =>
      row.Asset_description.toLowerCase().includes(search.toLowerCase()) ||
      row.Asset.toLowerCase().includes(search.toLowerCase())
    );
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = filterData().slice(startIndex, startIndex + itemsPerPage);


  return (
    <div className="background2">
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="absolute top-0 left-0 right-0 lg:h-64 md:h-48 sm:h-48 h-48 bg-blue-950 transform rounded-b-3xl">
        <a className="btn btn-ghost mt-5 ml-1 text-white" href="/home">
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
          <img
            src="https://minio.saksiam.co.th/public/saktech/logo/LogoParcel.png"
            className="lg:h-48 md:h-24 sm:h-24 h-32 lg:w-48 md:w-24 sm:w-24 w-32 lg:-mt-20 md:-mt-16 sm:-mt-16 -mt-16"
          />
          <label className="input input-bordered flex items-center gap-2 lg:w-1/3 md:w-2/3 sm:w-4/5 w-4/5">
            <input
              type="text"
              className="grow lg:w-1/3 md:w-2/3 sm:w-4/5 w-4/5"
              placeholder="ค้นหาข้อมูลพัสดุ....."
              value={search}
              onChange={handleChange}
            />
            <div className="flex justify-end lg:-ml-1 md:-ml-8 sm:-mr-5 -mr-5">
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

  
          <div className="mt-8"></div>
          <h1 className="mb-5 lg:text-3xl md:text-2xl sm:text-2xl text-3xl font-bold">
            รายการ
          </h1>
  
          <div className="justify-end items-end text-right lg:w-7/12 md:w-10/12 sm:w-10/12 w-10/12">
            <h1 className=" mb-1 lg:text-xl md:text-2xl sm:text-2xl text-lg">
              {countNochecked} / {count}
            </h1>
          </div>
          <div className="container contents">
            {selectedData ? selectedData.map((row) => (
              <div className="container flex items-center justify-center mb-2" key={row.Asset}>
                <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                  <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/Iconasset2.png"
                    className="lg:h-24 h-16 lg:w-24 w-16 m-4 lg:ml-5 ml-2"
                  />
                  <div className="flex flex-col lg:ml-5 ml-0">
                    <h1 className="lg:text-3xl md:text-1xl sm:text-xl font-bold">
                      {row.Asset_description}
                    </h1>
                    <h2 className="lg:text-lg md:text-lg text-sm mb-1">
                      {row.Asset}
                    </h2>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex lg:mr-10 md:mr-5 mr-4">
                    <a 
                      className="btn"
                      // href="/home/CheckThePackage/DetailAsset&NoAsset"
                      onClick={() => ClickDetailAsset(row)}
                    >
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
                    </a>
                  </div>
                </div>
              </div>
            )) : <div className="flex items-center justify-center h-screen">
                    <span className="loading loading-dots loading-lg text-blue-950"></span>
                  </div>
            }
          </div>
          <div className="join mt-5">
            <button 
              className="join-item btn lg:btn-lg md:btn-lg sm:btn-md btn-lg bg-blue-950 text-white"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button className="join-item btn lg:btn-lg md:btn-lg sm:btn-md btn-lg text-blue-950">หน้า {currentPage}</button>
            <button 
              className="join-item btn lg:btn-lg md:btn-lg sm:btn-md btn-lg bg-blue-950 text-white"
              onClick={handleNextPage}
              disabled={startIndex + itemsPerPage >= filterData().length}
            >
              »
            </button>
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