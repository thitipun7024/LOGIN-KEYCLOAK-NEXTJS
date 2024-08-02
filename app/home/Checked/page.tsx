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
  const [resultGroupBranchNo, setResultGroupBranch] = useState(null)
  const itemsPerPage = 10;

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
          //console.log(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDataSakHQ();

      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `/api/asset/GetDataAssetChecked?resultGroupBranch=${resultGroupBranch}&SakHQ=${sakHQ}`,
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

    }
  }, [session, sakHQ, resultGroupBranchNo]);

    //Function 
    const ClickDetailAsset = async (row) => { 
      sessionStorage.setItem('NoAsset', row.Asset);
      window.location.href = `/home/Checked/DetailAssetChecked`;
    };
    //Function

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on search change
  }, [search]);

  const filterData = () => {
    if (!Array.isArray(rows)) return [];
  
    const sortedData = rows.sort((a, b) => {
      const isAWaitingApproval = (a.Status === "1" && a.Asset_Status === "") ||
                                  (a.Status === "7" && a.Asset_Status === "") ||
                                  (a.Status === "14" && a.Asset_Status === "");
      const isBWaitingApproval = (b.Status === "1" && b.Asset_Status === "") ||
                                  (b.Status === "7" && b.Asset_Status === "") ||
                                  (b.Status === "14" && b.Asset_Status === "");
  
      if (isAWaitingApproval && !isBWaitingApproval) {
        return -1; // a comes before b
      }
      if (!isAWaitingApproval && isBWaitingApproval) {
        return 1; // b comes before a
      }
      return 0; // leave order unchanged
    });
  
    return sortedData.filter(row => {
      return row.Asset_description.toLowerCase().includes(search.toLowerCase()) ||
             row.Asset.toLowerCase().includes(search.toLowerCase());
    });
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
      <div className="absolute top-0 left-0 right-0 lg:h-64 md:h-60 sm:h-48 h-48 bg-blue-950 transform rounded-b-3xl">
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
        <a href="/home">
        <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/LOGO-ASSET-V2.png"
                    className="lg:h-32 md:h-32 sm:h-24 h-20 lg:w-48 md:w-48 sm:w-24 w-42 lg:-mt-12 md:-mt-12 sm:-mt-16 -mt-12 mb-5"
                  />
                </a>
          <label className="input input-bordered flex items-center gap-2 lg:w-1/3 md:w-2/3 sm:w-4/5 w-4/5">
            <input
              type="text"
              className="grow lg:w-1/3 md:w-2/3 sm:w-4/5 w-4/5"
              placeholder="ค้นหาข้อมูลพัสดุ....."
              value={search}
              onChange={handleChange}
            />
          </label>

  
          <div className="mt-8"></div>
          <h1 className="mb-5 mt-2 lg:text-4xl md:text-3xl sm:text-2xl text-3xl font-bold">
            รายการ
          </h1>

          <div className="container contents">
            {selectedData ? selectedData.map((row) => (
              <div className="container flex items-center justify-center mb-3" key={row.Asset}>
                <div className="card lg:w-9/12 md:w-3/4 sm:w-3/4 w-11/12 h-28 bg-blue-950 text-neutral-content shadow-xl flex flex-row items-center">
                  <img
                    src="https://minio.saksiam.co.th/public/saktech/logo/Iconasset2.png"
                    className="lg:h-24 h-16 lg:w-24 w-16 m-4 lg:ml-5 ml-4"
                  />
                  <div className="flex flex-col lg:ml-5 ml-0">
                    <h1 className="lg:text-3xl md:text-1xl sm:text-xl text-sm font-bold text-white">
                      {row.Asset_description}
                    </h1>
                    <h2 className="lg:text-lg md:text-lg sm:text-xl text-sm mb-1 text-white">
                      {row.Asset}
                    </h2>

                    {row.Status === "1" && row.Asset_Status === "2" && (
                        <div className="badge border-0 badge-md bg-green-600 text-white">
                            ปกติ
                        </div>
                    )}

                    {row.Status === "1" && row.Asset_Status === "" && (
                        <div className="badge border-0 badge-md bg-orange-500 text-white">
                          รอการอนุมัติ
                        </div>
                    )}

                    {row.Status === "7" && row.Asset_Status === "2" && (
                        <div className="badge border-0 badge-md bg-blue-500 text-white">
                            โยกย้าย
                        </div>
                    )}

                    {row.Status === "7" && row.Asset_Status === "" && (
                        <div className="badge border-0 badge-md bg-orange-500 text-white">
                          รอการอนุมัติ
                        </div>
                    )}

                    {row.Status === "14" && row.Asset_Status === "2" && (
                        <div className="badge border-0 badge-md bg-slate-500 text-white">
                            อื่นๆ
                        </div>
                    )}

                    {row.Status === "14" && row.Asset_Status === "" && (
                        <div className="badge border-0 badge-md bg-orange-500 text-white">
                          รอการอนุมัติ
                        </div>
                    )}
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex lg:mr-10 md:mr-5 mr-4">
                    <a 
                      className="btn"
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