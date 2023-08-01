import { TrackWithId } from "pages/Character/CharacterSheetPage/characterSheet.store";
import produce from "immer";
import { StoredAsset } from "types/Asset.type";
import { StoredCampaign } from "types/Campaign.type";
import { CharacterDocument } from "types/Character.type";
import { Note } from "types/Notes.type";
import { CampaignSettingsDoc } from "types/Settings.type";
import { TRACK_TYPES } from "types/Track.type";
import { OracleSettings } from "types/UserSettings.type";
import { create } from "zustand";
import {
  WorldStoreProperties,
  initialWorldState,
  worldStore,
} from "stores/world.slice";
import {
  CustomMovesStoreProperties,
  customMovesStore,
  initialCustomMovesState,
} from "stores/customMoves.slice";
import {
  CustomOraclesStoreProperties,
  customOraclesStore,
  initialCustomOraclesState,
} from "stores/customOracles.slice";

export type CampaignGMScreenStore = {
  resetState: () => void;

  campaignId?: string;
  campaign?: StoredCampaign;
  setCampaign: (campaignId: string, campaign?: StoredCampaign) => void;

  characters: {
    [characterId: string]: CharacterDocument;
  };
  updateCharacter: (characterId: string, character: CharacterDocument) => void;
  removeCharacter: (characterId: string) => void;

  characterAssets: { [characterId: string]: StoredAsset[] };
  setCharacterAssets: (characterId: string, assets: StoredAsset[]) => void;

  characterTracks: {
    [characterId: string]: {
      [TRACK_TYPES.VOW]: TrackWithId[];
      [TRACK_TYPES.JOURNEY]: TrackWithId[];
      [TRACK_TYPES.FRAY]: TrackWithId[];
    };
  };
  setCharacterTracks: (
    characterId: string,
    tracks: {
      [TRACK_TYPES.VOW]: TrackWithId[];
      [TRACK_TYPES.JOURNEY]: TrackWithId[];
      [TRACK_TYPES.FRAY]: TrackWithId[];
    }
  ) => void;

  tracks?: {
    [TRACK_TYPES.VOW]: TrackWithId[];
    [TRACK_TYPES.JOURNEY]: TrackWithId[];
    [TRACK_TYPES.FRAY]: TrackWithId[];
  };
  setTracks: (tracks: {
    [TRACK_TYPES.VOW]: TrackWithId[];
    [TRACK_TYPES.JOURNEY]: TrackWithId[];
    [TRACK_TYPES.FRAY]: TrackWithId[];
  }) => void;

  oracleSettings?: OracleSettings;
  setOracleSettings: (oracleSettings: OracleSettings) => void;

  campaignNotes?: Note[];
  setCampaignNotes: (notes: Note[]) => void;
  temporarilyReorderNotes: (noteId: string, order: number) => void;
  openNoteId?: string;
  setOpenNoteId: (openNoteId?: string) => void;

  campaignSettings?: CampaignSettingsDoc;
  setCampaignSettings: (settings: CampaignSettingsDoc) => void;
} & WorldStoreProperties &
  CustomMovesStoreProperties &
  CustomOraclesStoreProperties;

const initialState = {
  campaignId: undefined,
  campaign: undefined,

  players: {},
  characters: {},
  characterAssets: {},
  characterTracks: {},
  tracks: undefined,
  oracleSettings: undefined,
  campaignNotes: undefined,
  campaignSettings: undefined,

  ...initialWorldState,
  ...initialCustomMovesState,
  ...initialCustomOraclesState,
};

export const useCampaignGMScreenStore = create<CampaignGMScreenStore>()(
  (set, getState) => ({
    ...initialState,

    resetState: () =>
      set({
        ...getState(),
        ...initialState,
      }),

    setCampaign: (campaignId, campaign) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.campaignId = campaignId;
          store.campaign = campaign;
        })
      );
    },

    updateCharacter: (characterId, character) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.characters[characterId] = character;
        })
      );
    },
    removeCharacter: (characterId) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          delete store.characters[characterId];
        })
      );
    },

    setCharacterAssets: (characterId, assets) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.characterAssets[characterId] = assets;
        })
      );
    },

    setCharacterTracks: (
      characterId: string,
      tracks: {
        [TRACK_TYPES.VOW]: TrackWithId[];
        [TRACK_TYPES.JOURNEY]: TrackWithId[];
        [TRACK_TYPES.FRAY]: TrackWithId[];
      }
    ) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.characterTracks[characterId] = tracks;
        })
      );
    },

    setTracks: (tracks) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.tracks = tracks;
        })
      );
    },

    setOracleSettings: (settings) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.oracleSettings = settings;
        })
      );
    },

    setCampaignNotes: (notes) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.campaignNotes = notes;
        })
      );
    },

    temporarilyReorderNotes: (noteId, order) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          if (!store.campaignNotes) return;

          const noteIndex = store.campaignNotes.findIndex(
            (note) => note.noteId === noteId
          );

          if (typeof noteIndex !== "number" || noteIndex < 0) return;

          store.campaignNotes[noteIndex].order = order;
          store.campaignNotes.sort((n1, n2) => n1.order - n2.order);
        })
      );
    },

    setOpenNoteId: (noteId) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.openNoteId = noteId;
        })
      );
    },
    setCampaignSettings: (settings) => {
      set(
        produce((store: CampaignGMScreenStore) => {
          store.campaignSettings = settings;
        })
      );
    },

    ...worldStore(set),
    ...customMovesStore(set),
    ...customOraclesStore(set),
  })
);
