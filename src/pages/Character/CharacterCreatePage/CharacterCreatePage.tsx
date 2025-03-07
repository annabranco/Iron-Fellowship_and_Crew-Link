import { Alert, Box, Button } from "@mui/material";
import { Formik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SectionHeading } from "components/shared/SectionHeading";
import { StoredAsset } from "types/Asset.type";
import { Stat } from "types/stats.enum";
import { AssetsSection } from "./components/AssetsSection";
import { StatsField } from "./components/StatsField";
import { StatsMap } from "types/Character.type";
import { PageHeader } from "components/shared/Layout/PageHeader";
import { PageContent } from "components/shared/Layout";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { constructCharacterSheetPath } from "../routes";
import { TextFieldWithOracle } from "components/shared/TextFieldWithOracle/TextFieldWithOracle";
import { useRoller } from "stores/appState/useRoller";
import { useCallback, useState } from "react";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { addCharacterToCampaign } from "api-calls/campaign/addCharacterToCampaign";
import { ImageInput } from "./components/ImageInput";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useAppName } from "hooks/useAppName";

type CharacterCreateFormValues = {
  name: string;
  stats: { [key in Stat]: number | undefined };
  assets: StoredAsset[];
  portrait?: {
    image: File | string;
    scale: number;
    position: {
      x: number;
      y: number;
    };
  };
};

const nameOraclesIronsworn = [
  "ironsworn/oracles/name/ironlander/a",
  "ironsworn/oracles/name/ironlander/b",
];

const nameOracleStarforged = [
  "starforged/oracles/characters/names/given",
  "starforged/oracles/characters/names/family_name",
];

export function CharacterCreatePage() {
  const campaignId = useSearchParams()[0].get("campaignId");
  const uid = useStore((store) => store.auth.uid);

  const nameOracles = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: nameOraclesIronsworn,
    [GAME_SYSTEMS.STARFORGED]: nameOracleStarforged,
  });
  const joinOracles = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: false,
    [GAME_SYSTEMS.STARFORGED]: true,
  });

  const navigate = useNavigate();
  const { rollOracleTable } = useRoller();

  const [createCharacterLoading, setCreateCharacterLoading] =
    useState<boolean>(false);
  const createCharacter = useStore((store) => store.characters.createCharacter);

  const handleOracleRoll = useCallback(() => {
    if (joinOracles) {
      return nameOracles
        .map((id) => rollOracleTable(id, false) ?? "")
        .join(" ");
    } else {
      const oracleIndex = Math.floor(Math.random() * nameOracles.length);

      return rollOracleTable(nameOracles[oracleIndex], false);
    }
  }, [rollOracleTable, nameOracles, joinOracles]);

  const validate = (values: CharacterCreateFormValues) => {
    const errors: { [key in keyof CharacterCreateFormValues]?: string } = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (
      values.stats[Stat.Edge] === undefined ||
      !values.stats[Stat.Iron] === undefined ||
      !values.stats[Stat.Heart] === undefined ||
      !values.stats[Stat.Shadow] === undefined ||
      !values.stats[Stat.Wits] === undefined
    ) {
      errors.stats = "Stats are required";
    }

    return errors;
  };

  const handleSubmit = (values: CharacterCreateFormValues) => {
    setCreateCharacterLoading(true);
    createCharacter(
      values.name,
      values.stats as StatsMap,
      values.assets,
      values.portrait
    )
      .then((characterId) => {
        if (campaignId) {
          addCharacterToCampaign({ uid, campaignId, characterId }).finally(
            () => {
              // add character to campaign
              navigate(
                constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.SHEET)
              );
            }
          );
        } else {
          navigate(constructCharacterSheetPath(characterId));
        }
      })
      .catch(() => {})
      .finally(() => setCreateCharacterLoading(false));
  };

  const appName = useAppName();
  const gameSystem = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "an Ironsworn",
    [GAME_SYSTEMS.STARFORGED]: "a Starforged",
  });

  return (
    <>
      <Head
        title={"Create a Character"}
        description={`Create ${gameSystem} character on ${appName}`}
      />
      <PageHeader label={"Create your Character"} />
      <PageContent isPaper>
        <Formik
          initialValues={{
            name: "",
            stats: {
              [Stat.Edge]: undefined,
              [Stat.Heart]: undefined,
              [Stat.Iron]: undefined,
              [Stat.Shadow]: undefined,
              [Stat.Wits]: undefined,
            },
            assets: [],
          }}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {(form) => (
            <form onSubmit={form.handleSubmit}>
              <SectionHeading breakContainer label={"Character Details"} />
              <Alert severity={"info"} sx={{ mt: 2 }}>
                Your name, stats, and portrait can always be changed later fom
                the Character tab in your character sheet.
              </Alert>
              <Box display={"flex"} alignItems={"center"} mt={3}>
                <ImageInput name={form.values.name} />
                <div>
                  <TextFieldWithOracle
                    getOracleValue={() => handleOracleRoll() ?? ""}
                    label={"Name"}
                    name={"name"}
                    value={form.values.name}
                    onChange={(value) => form.setFieldValue("name", value)}
                    error={form.touched.name && !!form.errors.name}
                    helperText={form.touched.name && form.errors.name}
                    sx={{ maxWidth: 350, ml: 2 }}
                    fullWidth
                    variant={"filled"}
                    color={"primary"}
                  />
                </div>
              </Box>
              <StatsField />
              <AssetsSection />
              <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
                <Button
                  type={"submit"}
                  variant={"contained"}
                  disabled={createCharacterLoading}
                >
                  Create Character
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </PageContent>
    </>
  );
}
