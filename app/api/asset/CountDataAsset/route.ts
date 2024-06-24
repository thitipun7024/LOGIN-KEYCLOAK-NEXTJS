import prisma from '@/lib/prisma'
interface ResponseData{
    count: number
}

export async function GET() {
    try {
        const count: number = await prisma.assetMaster.count({
            where: {}
        });
        if(count !== undefined){
            const responseData: ResponseData = {
                count: count
            };
            return Response.json(responseData);
        } else {
            console.error("Error: Unable to fetch SMS count");
        }
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
          })
    }
}
