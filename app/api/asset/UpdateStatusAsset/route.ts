import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma'

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
    // const searchParams = reqs.nextUrl.searchParams
    // const NoAsset = searchParams.get("NoAsset")

    if(req.method === 'PUT'){
        const {Asset, Detail, Status, Asset_status } = req.body;

        try{
            const updateAsset = await prisma.no_Asset.update({
                where: { Asset: Asset, },
                data: {
                    Description: Detail,
                    Status: Status,
                    Asset_Status: Asset_status
                }
            })

            return res.status(200).json(updateAsset);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update asset' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}