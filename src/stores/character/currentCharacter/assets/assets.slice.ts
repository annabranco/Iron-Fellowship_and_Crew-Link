import { CreateSliceType } from "stores/store.type";
import { AssetSlice } from "./assets.slice.type";
import { defaultAssetsSlice } from "./assets.slice.default";
import { listenToAssets } from "api-calls/character/assets/listenToAssets";
import { addAsset } from "api-calls/character/assets/addAsset";
import { removeAsset } from "api-calls/character/assets/removeAsset";
import { updateAssetInput } from "api-calls/character/assets/updateAssetInput";
import { updateAssetCheckbox } from "api-calls/character/assets/updateAssetCheckbox";
import { updateAssetTrack } from "api-calls/character/assets/updateAssetTrack";
import { updateCustomAsset } from "api-calls/character/assets/updateCustomAsset";

export const createAssetsSlice: CreateSliceType<AssetSlice> = (
  set,
  getState
) => ({
  ...defaultAssetsSlice,

  subscribe: (characterId) => {
    set((store) => {
      store.characters.currentCharacter.assets.loading = true;
    });
    return listenToAssets(
      characterId,
      (assets) => {
        set((store) => {
          store.characters.currentCharacter.assets.assets = assets;
          store.characters.currentCharacter.assets.loading = false;
        });
      },
      (error) => {
        console.error(error);
        set((store) => {
          store.characters.currentCharacter.assets.loading = false;
          store.characters.currentCharacter.assets.error = error;
        });
      }
    );
  },

  addAsset: (asset) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return addAsset({ asset, characterId });
  },
  removeAsset: (assetId) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return removeAsset({ characterId, assetId });
  },
  updateAssetInput: (assetId, inputLabel, inputValue) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return updateAssetInput({ characterId, assetId, inputLabel, inputValue });
  },
  updateAssetCheckbox: (assetId, abilityIndex, checked) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }

    return updateAssetCheckbox({ characterId, assetId, abilityIndex, checked });
  },
  updateAssetTrack: (assetId, trackValue) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return updateAssetTrack({ characterId, assetId, value: trackValue });
  },
  updateCustomAsset: (assetId, asset) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return updateCustomAsset({ characterId, assetId, asset });
  },

  resetStore: () => {
    set((store) => {
      store.characters.currentCharacter.assets = {
        ...store.characters.currentCharacter.assets,
        ...defaultAssetsSlice,
      };
    });
  },
});
