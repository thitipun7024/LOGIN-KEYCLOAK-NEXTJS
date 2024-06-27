import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

const decodeURL = (encodedURL: string): string => {
    try {
      return decodeURIComponent(encodedURL);
    } catch (error) {
      console.error('Error decoding URL:', error);
      return '';
    }
  };

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const SakHQSearch: string | null = searchParams.get("SakHQ");
  
    if (!SakHQSearch) {
      return NextResponse.json({ error: 'SakHQSearch is required' }, { status: 400 });
    }
  
    // แปลง URL ที่ถูกเข้ารหัสกลับเป็นข้อความภาษาไทย
    const decodedSakHQSearch = decodeURL(SakHQSearch);
  
    try {
      const GetSakHQ = await prisma.costCTR.findFirst({
        where: {
          Name: decodedSakHQSearch
        }
      });
      return NextResponse.json(GetSakHQ);
    } catch (error) {
      console.error('Error fetching branch code:', error);
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
  }