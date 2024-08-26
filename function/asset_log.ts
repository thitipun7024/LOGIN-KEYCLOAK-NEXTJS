export default async function action_log(Create_by: string, Branch: string, Action: string, ActionDetail: string, Status: string, Asset: string, BranchAsset: string) {
    try {
        const dbResponse = await fetch(
          `/api/asset/LogAsset?Create_by=${Create_by}&Branch=${Branch}&Action=${Action}&ActionDetail=${ActionDetail}&Status=${Status}&Asset=${Asset}&BranchAsset=${BranchAsset}`,
          { 
            method: "POST",
            cache: "no-store"
          }
        );

        if (dbResponse.ok) {
            const dbJson = await dbResponse.json();
            //console.log("Success :", dbResponse.status);
            return dbJson;
        } else {
            console.error("Error :", dbResponse.status);
            throw new Error(`Failed to log action: ${dbResponse.status}`);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}