"use client";
import { useEffect, useState } from "react";
import Quagga from "quagga";

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

  const initCameraSelection = async () => {
    const devices = await Quagga.CameraAccess.enumerateVideoDevices();
    const streamLabel = Quagga.CameraAccess.getActiveStreamLabel();
    const deviceSelection = document.getElementById("deviceSelection") as HTMLSelectElement;

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

    const readerConfigGroup = document.querySelector(".controls .reader-config-group");
    if (readerConfigGroup) {
      readerConfigGroup.addEventListener("change", (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const value = target.type === "checkbox" ? querySelectedReaders() : target.value;
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

    const readerConfigGroup = document.querySelector(".controls .reader-config-group");
    if (readerConfigGroup) {
      readerConfigGroup.removeEventListener("change", () => {});
    }
  };

  const querySelectedReaders = () => {
    return Array.from(document.querySelectorAll(".readers input[type=checkbox]"))
      .filter((element) => (element as HTMLInputElement).checked)
      .map((element) => (element as HTMLInputElement).name);
  };

  const convertNameToState = (name: string) => {
    return name.replace("_", ".").split("-").reduce((result, value) => {
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
      const drawingCtx = drawingCanvas.getContext("2d", { willReadFrequently: true });

      if (result && drawingCtx) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")!),
            parseInt(drawingCanvas.getAttribute("height")!)
          );
          result.boxes
            .filter((box: any) => box !== result.box)
            .forEach((box: any) => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    let lastResult = "";
    Quagga.onDetected((result: any) => {
      const code: string = result.codeResult.code;
      const code2 = code.replace(/A/g, "");
      if (lastResult !== code2 && /^\d{12}$/.test(code2)) {
        setShowResult(code2);

        lastResult = code2;
        const node = document.createElement("li");
        node.innerHTML = `
            <div class="thumbnail">
              <div class="imgWrapper"><img src="${Quagga.canvas.dom.image.toDataURL()}" /></div>
              <div class="caption"><h4 class="code">${code}</h4></div>
            </div>
          `;
        const resultStrip = document.getElementById("result_strip");
        if (resultStrip) {
          const thumbnails = resultStrip.querySelector("ul.thumbnails");
          if (thumbnails) {
            thumbnails.prepend(node);
          }
        }
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
      <div className="container flex flex-col items-center justify-center min-h-screen mx-auto p-4">
        <div className="card w-11/12 max-w-lg items-center">
          <div id="interactive" className="viewport w-full h-full"></div>
        </div>
      </div>
    );
  }

  if (showResult !== "") {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="relative inline-flex group">
          <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
          <a
            onClick={handleBackToScan}
            title="Get quote now"
            className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            role="button"
          >
            แสกนบาร์โค้ดอีกครั้ง
          </a>
        </div>
        <br />
        {showResult}
        <div className="thumbnail"></div>

        <div className="flex items-center justify-center w-full">
    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" />
    </label>
</div> 
      </main>
    );
  }

  return null;
};

export default BarcodeScanner;
