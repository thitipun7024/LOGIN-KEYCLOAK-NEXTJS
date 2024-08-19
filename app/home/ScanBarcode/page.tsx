"use client"
import { useEffect, useState } from 'react';
import asset_log from "../../../function/asset_log";
import Quagga from 'quagga';
import Image from "next/image";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { Token } from "next-auth/jwt";

const BarcodeScanner = () => {
  const [state, setState] = useState({
    inputStream: {
      type: 'LiveStream',
      constraints: {
        width: { min: 640 },
        height: { min: 360 },
        // aspectRatio: { min: 1, max: 100 },
        facingMode: 'environment', // or user
      },
    },
    locator: {
      patchSize: 'large',
      halfSample: false,
    },
    numOfWorkers: 0,
    decoder: {
      readers: ['codabar_reader'],
    },
    locate: true,
    multiple: true,
  });

  const [usedecoded, setUseDecoded] = useState<Token | null>(null);
  const { data: session, status } = useSession();
  const [username, setusername] = useState<string>(null);
  const [resultGroupBranch, setResultGroupBranch] = useState(null);
  const [groupBaD_TH, setGroupBaD_TH] = useState(null);

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

  let lastResult = '';
  const [showResult, setShowResult] = useState<string>("");
  useEffect(() => {
    const handleAssetLog = async () => {
      if (showResult !== "") {
        try {
          await asset_log(
            usedecoded?.username || "unknown",
            resultGroupBranch,
            "Scan",
            "เเสกนบาร์โค้ด",
            "",
            showResult,
            ""
          );
          sessionStorage.setItem('NoAsset', showResult);
          window.location.href = `/home/CheckThePackage/DetailAsset`;
        } catch (error) {
          console.error("Error ModalChecked action:", error);
        }
      }
    };
  
    handleAssetLog();
  }, [showResult]);

  const initCameraSelection = async () => {
    const devices = await Quagga.CameraAccess.enumerateVideoDevices();
    const streamLabel = Quagga.CameraAccess.getActiveStreamLabel();
    const deviceSelection = document.getElementById('deviceSelection') as HTMLSelectElement;

    if (deviceSelection) {
      while (deviceSelection.firstChild) {
        deviceSelection.removeChild(deviceSelection.firstChild);
      }
      devices.forEach((device: any) => {
        const option = document.createElement('option');
        option.value = device.deviceId || device.id;
        option.appendChild(document.createTextNode(device.label || device.deviceId || device.id));
        option.selected = streamLabel === device.label;
        deviceSelection.appendChild(option);
      });

      deviceSelection.addEventListener('change', () => {
        const selectedDeviceId = deviceSelection.value;
        setState((prevState) => ({
          ...prevState,
          inputStream: {
            ...prevState.inputStream,
            constraints: {
              ...prevState.inputStream.constraints,
              deviceId: selectedDeviceId,
            },
          },
        }));
      });
    }
  };

  const attachListeners = () => {
    initCameraSelection();
    const stopButton = document.querySelector('.controls button.stop');
    if (stopButton) {
      stopButton.addEventListener('click', (e: any) => {
        e.preventDefault();
        Quagga.stop();
      });
    }

    const readerConfigGroup = document.querySelector('.controls .reader-config-group');
    if (readerConfigGroup) {
      readerConfigGroup.addEventListener('change', (e: any) => {
        e.preventDefault();
        const target = e.target;
        const value = target.type === 'checkbox' ? querySelectedReaders() : target.value;
        const name = target.name;

        if (name) {
          const statePath = convertNameToState(name);
          setState((prevState) => ({
            ...prevState,
            [statePath]: value,
          }));
        }
      });
    }
  };

  const detachListeners = () => {
    const stopButton = document.querySelector('.controls button.stop');
    if (stopButton) {
      stopButton.removeEventListener('click', (e: any) => {
        e.preventDefault();
        Quagga.stop();
      });
    }

    const readerConfigGroup = document.querySelector('.controls .reader-config-group');
    if (readerConfigGroup) {
      readerConfigGroup.removeEventListener('change', (e: any) => {
        e.preventDefault();
        const target = e.target;
        const value = target.type === 'checkbox' ? querySelectedReaders() : target.value;
        const name = target.name;

        if (name) {
          const statePath = convertNameToState(name);
          setState((prevState) => ({
            ...prevState,
            [statePath]: value,
          }));
        }
      });
    }
  };

  const querySelectedReaders = () => {
    return Array.from(document.querySelectorAll('.readers input[type=checkbox]'))
      .filter((element) => (element as HTMLInputElement).checked)
      .map((element) => (element as HTMLInputElement).name);
  };

  const convertNameToState = (name: string) => {
    if (!name) {
      return '';
    }
    return name.replace('_', '.').split('-').reduce((result, value) => {
      return result + value.charAt(0).toUpperCase() + value.substring(1);
    }, '');
  };

  useEffect(() => {
    const startQuagga = () => {
      Quagga.init(state, (err: any) => {
        if (err) {
          console.error(err);
          return;
        }
        attachListeners();
        Quagga.start();
      });
    };

    startQuagga();

    Quagga.onProcessed((result: any) => {
      const drawingCanvas = Quagga.canvas.dom.overlay;
      const drawingCtx = drawingCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      const canvasWidth = parseInt(drawingCanvas.getAttribute("width")!);
      const canvasHeight = parseInt(drawingCanvas.getAttribute("height")!);
      drawingCtx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Calculate middle of the canvas
      const middleX = canvasWidth / 2;
      const middleY = canvasHeight / 2;

      // Draw horizontal line in the middle
      drawingCtx.beginPath();
      drawingCtx.moveTo(0, middleY);
      drawingCtx.lineTo(canvasWidth, middleY);
      drawingCtx.strokeStyle = "red";
      drawingCtx.lineWidth = 2;
      drawingCtx.stroke();
      drawingCtx.closePath();

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')!), parseInt(drawingCanvas.getAttribute('height')!));
          result.boxes
            .filter((box: any) => box !== result.box)
            .forEach((box: any) => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
      }
    });

    Quagga.onDetected((result: any) => {
      const code: string = result.codeResult.code;
      const code2 = code.replace(/A/g, "");
      if (lastResult !== code2 && /^\d{12}$/.test(code2)) {
        setShowResult(code2);
        Quagga.offProcessed(() => { });
        Quagga.offDetected(() => { });
        Quagga.stop();
      }
      // if (lastResult !== code) {
      //   setLastResult(code);
      //   const node = document.createElement('li');
      //   node.innerHTML = `
      //     <div class="thumbnail">
      //       <div class="imgWrapper"><img /></div>
      //       <div class="caption"><h4 class="code"></h4></div>
      //     </div>
      //   `;
      //   node.querySelector('img')!.setAttribute('src', Quagga.canvas.dom.image.toDataURL());
      //   node.querySelector('h4.code')!.innerHTML = code;
      //   const resultStrip = document.getElementById('result_strip');
      //   if (resultStrip) {
      //     resultStrip.querySelector('ul.thumbnails')!.prepend(node);
      //   }
      // }
    });

    return () => {
      detachListeners();
      Quagga.stop();
    };
  }, [state]);

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

  if (showResult === "") {
    return (
      <div className="background2">
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="absolute top-0 left-0 right-0 h-44 bg-blue-950 transform rounded-b-3xl">
            <a className="btn btn-ghost mt-4 ml-3 text-white" onClick={ClickBackPage}>
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
              <a onClick={ClickLogoBackPage}>
                <div className="lg:h-32 md:h-32 sm:h-24 h-20 lg:w-48 md:w-48 sm:w-24 w-36 lg:-mt-12 md:-mt-12 sm:-mt-16 -mt-12 mb-5">
                  <Image
                    src="https://minio.saksiam.co.th/public/saktech/logo/LOGO-ASSET-V2.png"
                    alt="Picture of the author"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                    width={1200}
                    height={0}
                    priority
                  />
                </div>
              </a>
              <div className="card bg-clip-border lg:w-2/5 md:w-3/5 w-11/12 p-1 bg-base-100  shadow-xl flex flex-row items-center justify-center h-32">
                <h2 className="text-4xl font-bold">SCAN BARCODE</h2>
              </div>
              <div className="card w-10/12 max-w-lg items-center mt-5">
                <div id="interactive" className="viewport"></div>
                <div className="controls">
                  <div className="reader-config-group">
                    <h4>กล้อง</h4>
                    <select id="deviceSelection"></select>
                  </div>
                </div>
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
          </div>
        </div>
      </div>
    );
  }

  if (showResult !== "") {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-dots loading-lg text-blue-950"></span>
        </div>
      </div>
    );
  }

  return null;
};

export default BarcodeScanner;