import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const BranchCodeSearch = searchParams.get("resultGroupBranch")
  const SakHQCodeSearch = searchParams.get("SakHQ")
  const StatusWFA = "7";
  const StatusN = "1";
  const StatusO = "14";
  const StatusWFAA = "17";


  try {
    const countChecked = await prisma.assetMaster.count({
      where: {
        AND: [
          {
            OR: [
              BranchCodeSearch ? { Cost_Ctr: BranchCodeSearch } : {},
              SakHQCodeSearch ? { Cost_Ctr: SakHQCodeSearch } : {},
            ].filter(Boolean)
          },
          {
            OR: [
              { Status: StatusWFA },
              { Status: StatusN },
              { Status: StatusO },
              { Status: StatusWFAA }
            ]

          },
          {
            NOT: {
              Class: {
                in: ['600', '700'],
              },
            },
          },
          {
            NOT: {
              Asset: {
                in: ["100000000005", "210000002266", "D0001"],
              },
            },
          },
          {
            NOT: {
              Asset_description: {
                contains: "ยังไม่ได้",
              },
            },
          },
        ]
      }
    });

    if (countChecked !== undefined) {
      const responseData = {
        countAssetChecked: countChecked
      };
      return NextResponse.json(responseData);
    } else {
      console.error("Error: No Data");
      return NextResponse.json({ error: 'No Data' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching count:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
