import React from 'react'
import Button from '@/components/Login'
import '../globals.css'

export default function page() {
  return (
        <div className='background'>
            <div className="flex justify-center items-center">
                <img src="https://minio.saksiam.co.th/public/saktech/logo/logo-sak-ai-2.png" alt="SAK AI Logo" className="lg:w-1/12 md:w-3/12 w-2/5 mt-14" />
            </div>

            <div className='text-center mt-16 font-bold lg:text-6xl md:text-3xl text-4xl text-blue-950'>
                ระบบตรวจนับพัสดุ
            </div>

            <div className="flex justify-center items-center mt-2">
                <div className="badge badge-warning badge-lg text-center">
                    บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
                </div>
            </div>

            <div className="flex justify-center items-center mt-20">
                <Button />              
            </div>
        </div>
  )
}