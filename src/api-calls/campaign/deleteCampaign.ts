import { deleteDoc, deleteField, updateDoc } from "firebase/firestore";
import { getCharacterDoc } from "../character/_getRef";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { deleteNotes } from "api-calls/notes/deleteNotes";
import { getCampaignTracksDoc } from "api-calls/tracks/_getRef";
import { getCampaignSettingsDoc } from "api-calls/custom-move-oracle-settings/_getRef";
import { deleteAllProgressTracks } from "api-calls/tracks/deleteAllProgressTracks";
import { deleteAllLogs } from "api-calls/game-log/deleteAllLogs";

export const deleteCampaign = createApiFunction<
  { campaignId: string; characterIds: string[] },
  void
>((params) => {
  const { campaignId, characterIds } = params;

  return new Promise(async (resolve, reject) => {
    try {
      const characterPromises = characterIds.map((characterId) => {
        return updateDoc(getCharacterDoc(characterId), {
          campaignId: deleteField(),
        });
      });

      await Promise.all(characterPromises);
      resolve();
    } catch (e) {
      reject(e);
    }

    try {
      const campaignDeletePromise = deleteDoc(getCampaignDoc(campaignId));
      const noteDeletePromise = deleteNotes({ campaignId });
      const logDeletePromise = deleteAllLogs({ campaignId });
      const tracksDeletePromise = deleteAllProgressTracks({ campaignId });
      const settingsDeletePromise = deleteDoc(
        getCampaignSettingsDoc(campaignId)
      );

      await Promise.all([
        campaignDeletePromise,
        noteDeletePromise,
        tracksDeletePromise,
        settingsDeletePromise,
        logDeletePromise,
      ]);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}, "Failed to delete campaign.");
