import {
  AppBar,
  Box,
  Button,
  Container,
  Hidden,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  BASE_ROUTES,
  basePaths,
  CAMPAIGN_PREFIX,
  CHARACTER_PREFIX,
} from "../../routes";
import { ReactComponent as IronFellowshipLogo } from "./iron-fellowship-logo.svg";
import { useEffect, useState } from "react";
import { HeaderMenu } from "./HeaderMenu";

import CharacterIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Groups";
import WorldIcon from "@mui/icons-material/Public";
import { useStore } from "stores/store";
import { AUTH_STATE } from "stores/auth/auth.slice.type";

export function Header() {
  const theme = useTheme();
  const state = useStore((store) => store.auth.status);

  const path = useLocation().pathname;

  const [selectedTab, setSelectedTab] = useState<"character" | "campaign">();

  useEffect(() => {
    if (path.includes(CHARACTER_PREFIX)) {
      setSelectedTab("character");
    } else if (path.includes(CAMPAIGN_PREFIX)) {
      setSelectedTab("campaign");
    } else {
      setSelectedTab(undefined);
    }
  }, [path]);

  return (
    <AppBar elevation={0} position={"static"}>
      <Container maxWidth={"xl"}>
        <Toolbar
          variant={"dense"}
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <IronFellowshipLogo width={32} height={32} />
            <Typography fontFamily={"Staatliches"} variant={"h5"} ml={2}>
              Iron Fellowship
            </Typography>
          </Box>
          {state === AUTH_STATE.AUTHENTICATED ? (
            <Box>
              <Hidden smDown>
                <>
                  <Button
                    component={Link}
                    to={basePaths[BASE_ROUTES.CHARACTER]}
                    sx={{
                      color: "white",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    endIcon={<CharacterIcon />}
                  >
                    Characters
                  </Button>
                  <Button
                    component={Link}
                    to={basePaths[BASE_ROUTES.CAMPAIGN]}
                    sx={{
                      color: "white",
                      ml: 1,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    endIcon={<CampaignIcon />}
                  >
                    Campaigns
                  </Button>
                  <Button
                    component={Link}
                    to={basePaths[BASE_ROUTES.WORLD]}
                    sx={{
                      color: "white",
                      ml: 1,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    endIcon={<WorldIcon />}
                  >
                    Worlds
                  </Button>
                </>
              </Hidden>
              <HeaderMenu />
            </Box>
          ) : (
            <Stack direction={"row"} spacing={1}>
              <Button
                color={"secondary"}
                component={Link}
                to={basePaths[BASE_ROUTES.LOGIN]}
              >
                Login
              </Button>
              <Button
                variant={"contained"}
                color={"secondary"}
                component={Link}
                to={basePaths[BASE_ROUTES.SIGNUP]}
              >
                Create Account
              </Button>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
