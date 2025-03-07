import React from 'react'
import Button from '@/components/Login'
import '../globals.css'
import Image from 'next/image'

export default function page() {

  return (
        <div className='background'>
            <div className="flex justify-center items-center">
                <div className='lg:h-52 md:h-52 sm:h-40 h-40 lg:w-52 md:w-52 sm:w40 w-40 mt-14'>
                <Image
                    src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png"
                    alt="Icon Asset"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                    width={1200}
                    height={0}
                    priority
                  />
                </div>
            </div>

            <div className='text-center mt-16 font-bold lg:text-6xl md:text-5xl sm:text-3xl text-3xl text-blue-950'>
                ระบบตรวจนับสินทรัพย์
            </div>

            <div className="flex justify-center items-center mt-2">
                <div className="badge badge-warning badge-lg text-center">
                    บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
                </div>
            </div>

            <div className="flex justify-center items-center mt-20">
                <Button />              
            </div>

            <footer className="footer footer-center p-4 text-base-content lg:mt-60 md:mt-96 sm:mt-32 mt-40">
                <aside>
                    <p className="lg:text-lg md:text-base sm:text-sm text-sm">
                    © 2024 All Right Reserve By SakTech
                    </p>
                    <p className="lg:text-lg md:text-base sm:text-sm text-sm">
                    VERSION {process.env.NEXT_PUBLIC_VERSION}
                    </p>
                </aside>
            </footer>
        </div>
  )
}