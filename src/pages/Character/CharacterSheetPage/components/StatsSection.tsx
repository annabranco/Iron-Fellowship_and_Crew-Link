import { Box } from "@mui/material";
import { StatsMap } from "types/Character.type";

import { Stat } from "types/stats.enum";
import { StatComponent } from "components/StatComponent";
import { useStore } from "stores/store";

export function StatsSection() {
  // We know character is defined at this point, hence the typecasting
  const stats = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.stats
  ) as StatsMap;
  const health = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.health
  ) as number;
  const spirit = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.spirit
  ) as number;

  const supply = useStore(
    (store) =>
      (store.characters.currentCharacter.currentCharacter?.campaignId
        ? store.campaigns.currentCampaign.currentCampaign?.supply
        : store.characters.currentCharacter.currentCharacter?.supply) ?? 5
  );

  return (
    <Box display={"flex"} flexWrap={"wrap"} justifyContent={"flex-start"}>
      <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
        <StatComponent
          label={"Edge"}
          value={stats[Stat.Edge]}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Heart"}
          value={stats[Stat.Heart]}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Iron"}
          value={stats[Stat.Iron]}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Shadow"}
          value={stats[Stat.Shadow]}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Wits"}
          value={stats[Stat.Wits]}
          sx={{ my: 0.5, mr: 4 }}
        />
      </Box>
      <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} pl={0.5}>
        <StatComponent
          label={"Health"}
          value={health}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Spirit"}
          value={spirit}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent label={"Supply"} value={supply} sx={{ my: 0.5 }} />
      </Box>
    </Box>
  );
}
