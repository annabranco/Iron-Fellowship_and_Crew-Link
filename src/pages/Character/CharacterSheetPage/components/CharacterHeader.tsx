import {
  Box,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { InitiativeButtons } from "./InitiativeButtons";
import { StatsSection } from "./StatsSection";
import { useStore } from "stores/store";
import LinkIcon from "@mui/icons-material/Launch";
import { Link } from "react-router-dom";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { useIsMobile } from "hooks/useIsMobile";

import { StickyHeader } from "components/shared/StickyHeader";
import { CharacterHeaderMoveOracleButtons } from "./CharacterHeaderMoveOracleButtons";
import { CharacterPortrait } from "./CharacterPortrait";

export function CharacterHeader() {
  const characterName = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name ?? ""
  );

  const campaignId = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const isGM = useStore(
    (store) =>
      store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
        store.auth.uid
      ) ?? false
  );

  const theme = useTheme();
  const isMobile = useIsMobile();
  const isSmall = useMediaQuery(theme.breakpoints.down("md")) && !isMobile;

  return (
    <StickyHeader
      maxStickyBreakpoint={"sm"}
      outerChildren={
        (isMobile || isSmall) && <CharacterHeaderMoveOracleButtons />
      }
    >
      <Box display={"flex"} alignItems={"center"}>
        <CharacterPortrait />
        <Box display={"flex"} flexDirection={"column"} marginLeft={1}>
          <Typography
            variant={"h4"}
            lineHeight={1}
            color={"white"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {characterName}
          </Typography>
          <Stack spacing={1} direction={"row"}>
            <InitiativeButtons />
            {campaignId && !isMobile && (
              <Chip
                size={"small"}
                color={"primary"}
                variant={"outlined"}
                icon={<LinkIcon />}
                label="Campaign"
                component={Link}
                to={constructCampaignSheetPath(
                  campaignId,
                  CAMPAIGN_ROUTES.SHEET
                )}
                clickable
              />
            )}
            {campaignId && isGM && (
              <Chip
                size={"small"}
                color={"primary"}
                icon={<LinkIcon />}
                label={"GM Screen"}
                component={Link}
                to={constructCampaignSheetPath(
                  campaignId,
                  CAMPAIGN_ROUTES.GM_SCREEN
                )}
                clickable
              />
            )}
          </Stack>
        </Box>
      </Box>
      {!isMobile && <StatsSection />}
    </StickyHeader>
  );
}
