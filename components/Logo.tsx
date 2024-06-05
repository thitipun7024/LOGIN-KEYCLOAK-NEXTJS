'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../app/globals.css';

const ClientLogo: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/Login');
        }, 5000); // ระยะเวลาแอนิเมชัน 5 วินาที

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen logoContainer">
            <img src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-white.png" alt="Logo" width="200" />
        </div>
    );
};

export default ClientLogo;