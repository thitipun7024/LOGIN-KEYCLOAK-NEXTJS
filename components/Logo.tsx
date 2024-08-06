'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../app/globals.css';
import Image from 'next/image';

const ClientLogo: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/login'); // เปลี่ยนเป็น '/login' แทน '/Login'
        }, 3000); // ระยะเวลาแอนิเมชัน 3 วินาที

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen logoContainer">
            {/* <img src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-white.png" alt="Logo" width="200" /> */}
            <Image src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-white.png" alt="Logo" width={200} height={0} />
        </div>
    );
};

export default ClientLogo;
