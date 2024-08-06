import {  NextResponse } from 'next/server';
export async function POST() {
  try {
    const a = process.env.SMARTCARD_URI
    return NextResponse.json({ uri : a});
  } catch (error) {
    console.error(error + ':' + process.env.API_PY_URL_PPIMG);
    return NextResponse.json({ error: error.toString() + ':' + process.env.API_PY_URL_PPIMG }, { status: 500 });
  }
}