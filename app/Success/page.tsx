'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import '../globals.css';

const ClientSuccess: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/home/CheckThePackage'); 
        }, 1000); 

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="client-success-page flex items-center justify-center lg:mt-60 md:mt-80 sm:mt-48 mt-48 pulse">
            <div className="lg:w-2/5 md:w-2/5 sm:w-1/2 w-2/5">
          <Image
            src="https://minio.saksiam.co.th/public/saktech/logo/checked512.png"
            alt="Icon Asset"
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
        <h1 className='mt-5 lg:text-5xl md:text-4xl sm:text-2xl text-2xl font-bold text-blue-950'>ส่งการตรวจนับสำเร็จ</h1>
        </div>
        
    );
};

export default ClientSuccess;

