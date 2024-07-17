'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
        <div className="client-success-page flex flex-col items-center justify-center mt-48 pulse">
            <img src="https://minio.saksiam.co.th/public/saktech/logo/checked512.png" alt="Logo" className='lg:w-1/2 md:w-2/5 sm:w-1/2 w-2/5' />
            <h1 className='mt-5 lg:text-5xl md:text-5xl sm:text-2xl text-2xl font-bold text-blue-950'>ส่งการตรวจนับสำเร็จ</h1>
        </div>
    );
};

export default ClientSuccess;