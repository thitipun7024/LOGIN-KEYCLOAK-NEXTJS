import React from "react";
import Logout from '@/components/Logout';

export default function page() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="absolute top-0 left-0 right-0 h-44 bg-blue-950 transform rounded-b-3xl">
          <div className=" flex justify-center items-center">
            <div className="card lg:w-1/4 md:w-2/4 w-11/12 p-3 bg-base-100 shadow-xl mt-24 flex flex-row items-center justify-center">
              <img
                src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png"
                className="h-20 w-20 m-4 ml-2"
              />
              <div className="flex flex-col">
                  <h2 className="lg:text-2xl md:text-1xl text-xl font-bold">สุพัฒพงศ์ แสงสุรเดช</h2>
                  <h2 className="text-lg">ฝ่ายสารสนเทศ</h2>
                  <h2 className="text-lg">ผู้ช่วยหัวหน้าฝ่าย(infar)</h2>
              </div>
                
                <div className="ml-7">
                  <Logout />
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
