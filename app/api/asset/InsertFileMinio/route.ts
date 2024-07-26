import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch'; // Make sure to install node-fetch
import FormData from 'form-data'; // Make sure to install form-data

export async function POST(req: NextRequest) {
  try {
    // Extracting the file from the request
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      throw new Error('Invalid file');
    }

    // Convert file to Buffer if needed (for Node.js environment)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate the dag_run_id and formattedDate
    const datetimeString = new Date().toISOString();
    const dag_run_id = datetimeString.replace(/\D/g, "");
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("en-CA", { year: "numeric", month: "2-digit" })
      .replace(/-/g, "/");

    // Prepare headers
    const myHeaders = new Headers();
    myHeaders.append("Authorization", process.env.MINIO_AUTH as string);
    myHeaders.append("access", process.env.MINIO_ACCESS as string);
    myHeaders.append("secret", process.env.MINIO_SECRET as string);

    // Prepare form data
    const uploadFormData = new FormData();
    uploadFormData.append("file", buffer, file.name);
    uploadFormData.append("bucket", process.env.MINIO_BUCKET as string);
    uploadFormData.append("path", formattedDate);
    uploadFormData.append("url", process.env.MINIO_URL as string);

    // Prepare request options
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: uploadFormData,
    };

    const minioResponse = await fetch(process.env.API_PY_URL_PPIMG, requestOptions);
    const json:any = await minioResponse.json();
    const result = json.message;
    return NextResponse.json(result);
  } catch (error) {
    console.error(error + ':' + process.env.API_PY_URL_PPIMG);
    return NextResponse.json({ error: error.toString() + ':' + process.env.API_PY_URL_PPIMG }, { status: 500 });
  }
}