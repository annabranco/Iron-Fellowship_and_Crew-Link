import { Box, ButtonBase, Card, Divider, Typography, useTheme } from "@mui/material";
import { ROLL_RESULT, StatRoll } from "types/DieRolls.type";
import { D6Icon } from "assets/D6Icon";
import { D10Icon } from "assets/D10Icon";

export const getRollResultLabel = (result: ROLL_RESULT) => {
  switch (result) {
    case ROLL_RESULT.HIT:
      return "Strong Hit";
    case ROLL_RESULT.WEAK_HIT:
      return "Weak Hit";
    case ROLL_RESULT.MISS:
      return "Miss";
  }
};

export interface StatRollSnackbarProps {
  roll: StatRoll;
  clearRoll?: () => void;
  expanded: boolean;
}

export function StatRollSnackbar(props: StatRollSnackbarProps) {
  const { roll, clearRoll, expanded } = props;
  const theme = useTheme();

  const rollTotal = roll.action + (roll.modifier ?? 0) + (roll.adds ?? 0);

  let rollActionColor = theme.palette.grey[200];

  if (roll.action === 1){
    rollActionColor = theme.palette.warning.light;
  }

  return (
    <Card
      sx={(theme) => ({
        px: 2,
        py: 1,
        backgroundColor: theme.palette.darkGrey.dark,
        color: theme.palette.darkGrey.contrastText,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        mt: 1,
      })}
      component={clearRoll ? ButtonBase : "div"}
      onClick={clearRoll ? () => clearRoll() : undefined}
    >
      <Typography
        variant={expanded ? "h6" : "subtitle1"}
        fontFamily={(theme) => theme.fontFamilyTitle}
      >
        {roll.moveName
          ? `${roll.moveName} (${roll.rollLabel})`
          : roll.rollLabel}
      </Typography>
      <Box display={"flex"} flexDirection={"row"}>
        {expanded && (
          <Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <D6Icon />
              <Typography ml={1} color={rollActionColor}>
                {roll.action}
              </Typography>
              <Typography ml={1} color={(theme) => theme.palette.grey[200]}>
                {roll.modifier ? ` + ${roll.modifier}` : ""}
                {roll.adds ? ` + ${roll.adds}` : ""}
                {roll.modifier || roll.adds
                  ? ` = ${rollTotal > 10 ? "10 (Max)" : rollTotal}`
                  : ""}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <D10Icon />
              <Typography ml={1} color={(theme) => theme.palette.grey[200]}>
                {roll.challenge1}, {roll.challenge2}
              </Typography>
            </Box>
          </Box>
        )}
        {expanded && (
          <Divider
            orientation={"vertical"}
            sx={(theme) => ({
              alignSelf: "stretch",
              borderColor: theme.palette.grey[400],
              height: "auto",
              mx: 2,
            })}
          />
        )}
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-start"}
          justifyContent={"center"}
        >
          <Typography
            color={"white"}
            variant={"h5"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {getRollResultLabel(roll.result)}
          </Typography>
          {roll.challenge1 === roll.challenge2 && (
            <Typography
              color={(theme) => theme.palette.grey[200]}
              variant={"caption"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Doubles
            </Typography>
          )}
          {roll.action === 1 && (
            <Typography
              color={(theme) => theme.palette.grey[200]}
              variant={"caption"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Natural 1
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
}
