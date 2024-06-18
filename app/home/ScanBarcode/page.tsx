"use client";
import { useEffect, useState, createContext, useContext } from "react";
import Quagga from "quagga";

const DataContext = createContext(null);

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

interface BarcodeContextType {
  barcode: string;
  setBarcode: (barcode: string) => void;
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
      halfSample: true,
    },
    numOfWorkers: 4,
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
      window.location.href = `/home/CheckThePackage?asset=${showResult}`;
    }
  }, [showResult]);

  const initCameraSelection = async () => {
    const devices = await Quagga.CameraAccess.enumerateVideoDevices();
    const streamLabel = Quagga.CameraAccess.getActiveStreamLabel();
    const deviceSelection = document.getElementById(
      "deviceSelection"
    ) as HTMLSelectElement;

    if (deviceSelection) {
      while (deviceSelection.firstChild) {
        deviceSelection.removeChild(deviceSelection.firstChild);
      }
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
      stopButton.addEventListener("click", (e: Event) => {
        e.preventDefault();
        Quagga.stop();
      });
    }

    const readerConfigGroup = document.querySelector(
      ".controls .reader-config-group"
    );
    if (readerConfigGroup) {
      readerConfigGroup.addEventListener("change", (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const value =
          target.type === "checkbox" ? querySelectedReaders() : target.value;
        const name = target.name;
        const statePath = convertNameToState(name);

        setState((prevState) => ({
          ...prevState,
          [statePath]: value,
        }));
      });
    }
  };

  const detachListeners = () => {
    const stopButton = document.querySelector(".controls button.stop");
    if (stopButton) {
      stopButton.removeEventListener("click", () => Quagga.stop());
    }

    const readerConfigGroup = document.querySelector(
      ".controls .reader-config-group"
    );
    if (readerConfigGroup) {
      readerConfigGroup.removeEventListener("change", () => {});
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

    // Quagga.onProcessed((result: any) => {
    //   const drawingCanvas = Quagga.canvas.dom.overlay;
    //   const drawingCtx = drawingCanvas.getContext("2d", {
    //     willReadFrequently: true,
    //   });

    //   if (result && drawingCtx) {
    //     if (result.boxes) {
    //       drawingCtx.clearRect(
    //         0,
    //         0,
    //         parseInt(drawingCanvas.getAttribute("width")!),
    //         parseInt(drawingCanvas.getAttribute("height")!)
    //       );
    //       result.boxes
    //         .filter((box: any) => box !== result.box)
    //         .forEach((box: any) => {
    //           Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
    //             color: "green",
    //             lineWidth: 2,
    //           });
    //         });
    //     }

    //     if (result.box) {
    //       Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
    //         color: "#00F",
    //         lineWidth: 2,
    //       });
    //     }

    //     if (result.codeResult && result.codeResult.code) {
    //       Quagga.ImageDebug.drawPath(
    //         result.line,
    //         { x: "x", y: "y" },
    //         drawingCtx,
    //         { color: "red", lineWidth: 3 }
    //       );
    //     }
    //   }
    // });

    let lastResult = "";
    Quagga.onDetected((result: any) => {
      const code: string = result.codeResult.code;
      const code2 = code.replace(/A/g, "");
      if (lastResult !== code2 && /^\d{12}$/.test(code2)) {
        setShowResult(code2);

        lastResult = code2;
        // const node = document.createElement("li");
        // node.innerHTML = `
        //     <div class="thumbnail">
        //       <div class="imgWrapper"><img src="${Quagga.canvas.dom.image.toDataURL()}" /></div>
        //       <div class="caption"><h4 class="code">${code}</h4></div>
        //     </div>
        //   `;
        // const resultStrip = document.getElementById("result_strip");
        // if (resultStrip) {
        //   const thumbnails = resultStrip.querySelector("ul.thumbnails");
        //   if (thumbnails) {
        //     thumbnails.prepend(node);
        //   }
        // }
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
      // <div className="container flex flex-col items-center justify-center min-h-screen mx-auto p-4">
      //   <div className="card w-11/12 max-w-lg items-center">
      //     <div id="interactive" className="viewport w-full"></div>
      //   </div>
      // </div>
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
              <h2 className="text-white lg:text-4xl text-2xl  font-bold mb-4">
                ระบบตรวจนับพัสดุ
              </h2>
              <div className="card bg-clip-border lg:w-2/5 md:w-3/5 w-11/12 p-1 bg-base-100  shadow-xl flex flex-row items-center justify-center h-32">
                <h2 className="text-4xl font-bold">SCAN BARCODE</h2>
              </div>
              <div className="container flex flex-col items-center justify-center min-h-screen mx-auto p-4">
                <div className="card w-11/12 max-w-lg items-center">
                  <div id="interactive" className="viewport w-full"></div>
                </div>
              </div>
              <footer className="footer footer-center p-4 text-base-content mt-80">
                <aside>
                  <p>Copyright © 2024</p>
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

// ParentComponent.tsx

// import React from 'react'

// export default function page() {
//   return (
//     <div>
//       <a
//       className='btn'
//       href='/home/CheckThePackage?asset=123456789'>
//         button
//       </a>
//     </div>
//   )
// }
