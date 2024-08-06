"use client";
import { useEffect, useState } from "react";
import Quagga from "quagga";
import Image from "next/image";

interface QuaggaState {
  inputStream: {
    type: string;
    constraints: {
      width: { min: number };
      height: { min: number };
      aspectRatio: { min: number; max: number };
      facingMode: string;
    };
  };
  locator: {
    patchSize: string;
    halfSample: boolean;
  };
  numOfWorkers: number;
  decoder: {
    readers: string[];
  };
  locate: boolean;
  multiple: boolean;
}

const BarcodeScanner = () => {
  const [state, setState] = useState<QuaggaState>({
    inputStream: {
      type: "LiveStream",
      constraints: {
        width: { min: 640 },
        height: { min: 480 },
        aspectRatio: { min: 1, max: 100 },
        facingMode: "environment",
      },
    },
    locator: {
      patchSize: "large",
      halfSample: false,
    },
    numOfWorkers: 0,
    decoder: {
      readers: ["codabar_reader"],
    },
    locate: true,
    multiple: true,
  });

  const [showResult, setShowResult] = useState<string>("");

  const handleBackToScan = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (showResult !== "") {
      sessionStorage.setItem('NoAsset', showResult);
      window.location.href = `/home/CheckThePackage/DetailAsset`;
    }
  }, [showResult]);

  const initCameraSelection = async () => {
    const devices = await Quagga.CameraAccess.enumerateVideoDevices();
    const streamLabel = Quagga.CameraAccess.getActiveStreamLabel();
    const deviceSelection = document.getElementById(
      "deviceSelection"
    ) as HTMLSelectElement;

    if (deviceSelection) {
      deviceSelection.innerHTML = ""; // ล้างรายการที่มีอยู่แล้ว
      devices.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId || device.id;
        option.appendChild(
          document.createTextNode(device.label || device.deviceId || device.id)
        );
        option.selected = streamLabel === device.label;
        deviceSelection.appendChild(option);
      });
    }
  };

  const attachListeners = () => {
    initCameraSelection();

    const stopButton = document.querySelector(".controls button.stop");
    if (stopButton) {
      stopButton.addEventListener("click", handleStopClick);
    }

    const readerConfigGroup = document.querySelector(
      ".controls .reader-config-group"
    );
    if (readerConfigGroup) {
      readerConfigGroup.addEventListener("change", handleReaderConfigChange);
    }
  };

  const handleStopClick = (e: Event) => {
    e.preventDefault();
    Quagga.stop();
  };

  const handleReaderConfigChange = (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const value =
      target.type === "checkbox" ? querySelectedReaders() : target.value;
    const statePath = convertNameToState(target.name);

    setState((prevState) => ({
      ...prevState,
      [statePath]: value,
    }));
  };

  const detachListeners = () => {
    const stopButton = document.querySelector(".controls button.stop");
    if (stopButton) {
      stopButton.removeEventListener("click", handleStopClick);
    }

    const readerConfigGroup = document.querySelector(
      ".controls .reader-config-group"
    );
    if (readerConfigGroup) {
      readerConfigGroup.removeEventListener("change", handleReaderConfigChange);
    }
  };

  const querySelectedReaders = () => {
    return Array.from(
      document.querySelectorAll(".readers input[type=checkbox]")
    )
      .filter((element) => (element as HTMLInputElement).checked)
      .map((element) => (element as HTMLInputElement).name);
  };

  const convertNameToState = (name: string) => {
    return name
      .replace("_", ".")
      .split("-")
      .reduce((result, value) => {
        return result + value.charAt(0).toUpperCase() + value.substring(1);
      });
  };

  useEffect(() => {
    Quagga.init(state, (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      attachListeners();
      Quagga.start();
    });

    Quagga.onProcessed((result: any) => {
      const drawingCanvas = Quagga.canvas.dom.overlay;
      const drawingCtx = drawingCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      const canvasWidth = parseInt(drawingCanvas.getAttribute("width")!);
      const canvasHeight = parseInt(drawingCanvas.getAttribute("height")!);
      drawingCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      // Calculate middle of the canvas
      const middleX = canvasWidth / 2.2;
      const middleY = canvasHeight / 2.2;
      // Draw horizontal line in the middle
      drawingCtx.beginPath();
      drawingCtx.moveTo(0, middleY);
      drawingCtx.lineTo(canvasWidth, middleY);
      drawingCtx.strokeStyle = "red";
      drawingCtx.lineWidth = 3;
      drawingCtx.stroke();
      drawingCtx.closePath();
    });

    let lastResult = "";
    Quagga.onDetected((result: any) => {
      const code: string = result.codeResult.code;
      const code2 = code.replace(/A/g, "");
      if (lastResult !== code2 && /^\d{12}$/.test(code2)) {
        setShowResult(code2);

        lastResult = code2;
        Quagga.offProcessed(() => {});
        Quagga.offDetected(() => {});
        Quagga.stop();
      }
    });

    return () => {
      detachListeners();
      Quagga.stop();
    };
  }, [state]);

  if (showResult === "") {
    return (
      <div className="background2">
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="absolute top-0 left-0 right-0 h-44 bg-blue-950 transform rounded-b-3xl">
          <a className="btn btn-ghost mt-4 ml-3 text-white" href="/home/CheckThePackage">
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
            <a href="/home">
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
                  <div id="interactive" className="viewport w-full"></div>
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