import { SectorHexagon, SectorHexagonProps } from "./SectorHexagon";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  tooltipClasses,
  Card,
  useTheme,
  Typography,
} from "@mui/material";
import { SECTOR_HEX_TYPES, hexTypeMap } from "./hexTypes";
import PathIcon from "@mui/icons-material/Timeline";
import { CreatureIcon } from "./assets/CreatureIcon";
import { PlanetIcon } from "./assets/PlanetIcon";
import { SettlementIcon } from "./assets/SettlementIcon";
import { StarIcon } from "./assets/StarIcon";
import { DerelictIcon } from "./assets/DerelictIcon";
import { SightingIcon } from "./assets/SightingIcon";
import { ShipIcon } from "./assets/ShipIcon";
import { VaultIcon } from "./assets/VaultIcon";
import { useState } from "react";
import { useStore } from "stores/store";
import HelpIcon from "@mui/icons-material/Help";
import { SectorMap as ISectorMap } from "types/Sector.type";

export interface SectorMapProps {
  map: ISectorMap;
}

export function SectorMap(props: SectorMapProps) {
  const { map } = props;

  const theme = useTheme();

  const [currentSelectionTool, setCurrentSelectionTool] =
    useState<SECTOR_HEX_TYPES>();

  const rows = 13;
  const cols = 18;
  const s = 20;

  const updateHex = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.updateHex
  );

  // Calculate SVG dimensions
  const width: number = cols * s * Math.sqrt(3) + (s * Math.sqrt(3)) / 2; // Updated
  const height: number = rows * 1.5 * s + s / 2 + 1; // Updated

  const verticalSpacing: number = 1.5 * s; // Updated
  const horizontalSpacing: number = s * Math.sqrt(3); // Updated
  const offsetX: number = (s * Math.sqrt(3)) / 2; // New offset for vertical positioning

  return (
    <Box
      width={"100%"}
      overflow={"hidden"}
      sx={(theme) => ({
        bgcolor:
          theme.palette.mode === "light"
            ? theme.palette.grey[900]
            : theme.palette.background.default,
        p: 2,
      })}
    >
      <Box
        sx={(theme) => ({
          width: "100%",
          color: "#fff",
          overflowX: "auto",
          "&>svg": {
            display: "flex",
            marginX: "auto",
          },

          "& .hexagon": {
            cursor: "pointer",
            fill: theme.palette.grey[900],
            fillOpacity: "100%",
            color: theme.palette.grey[600],
            "&:hover": {
              fill: theme.palette.grey[800],
              fillOpacity: "100%",
            },
          },
          "& .path-line": {
            color: theme.palette.grey[300],
            background: "none",
            pointerEvents: "none",
            height: 0,
            overflow: "visible",
          },
        })}
      >
        <svg
          width={width}
          height={height}
          style={{ minWidth: width, minHeight: height }}
        >
          {new Array(rows).fill(0).map((r, row) => {
            return new Array(cols - (row % 2 === 1 ? 1 : 0))
              .fill(0)
              .map((c, col) => {
                const x: number =
                  col * horizontalSpacing + (row % 2 === 1 ? offsetX : 0) + s; // Offset every other row
                const y: number = row * verticalSpacing + s; // Start with one hexagon's height

                const type = map[row]?.[col]?.type;

                let pathConnections: SectorHexagonProps["pathConnections"] =
                  undefined;
                if (type === SECTOR_HEX_TYPES.PATH) {
                  pathConnections = getConnections(map, row, col);
                }
                return (
                  <SectorHexagon
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    size={s}
                    type={type}
                    pathConnections={pathConnections}
                    onClick={() =>
                      currentSelectionTool &&
                      updateHex(
                        row,
                        col,
                        type === currentSelectionTool
                          ? undefined
                          : currentSelectionTool
                      )
                    }
                  />
                );
              });
          })}
        </svg>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        mt={2}
      >
        <ToggleButtonGroup
          value={currentSelectionTool}
          onChange={(evt, value) => setCurrentSelectionTool(value)}
          exclusive
          color={"primary"}
          sx={(theme) => ({
            ["& button"]: {
              borderColor: theme.palette.grey[500],
              "&:hover": {
                bgcolor:
                  theme.palette.grey[theme.palette.mode === "dark" ? 800 : 700],
              },
            },
          })}
        >
          {(Object.keys(hexTypeMap) as SECTOR_HEX_TYPES[]).map((hexTypeKey) => {
            const { color = "#fff", name, Icon } = hexTypeMap[hexTypeKey];
            return (
              <Tooltip title={name} key={hexTypeKey}>
                <ToggleButton value={hexTypeKey}>
                  <Icon
                    sx={{
                      color,
                    }}
                  />
                </ToggleButton>
              </Tooltip>
            );
          })}
        </ToggleButtonGroup>
        <Tooltip
          title={
            <Box p={1} maxWidth={300}>
              <Typography variant={"body2"}>
                Click an icon on the left to select it, then click a hex on the
                map to place it.
              </Typography>
            </Box>
          }
          slots={{ tooltip: Card }}
          slotProps={{
            tooltip: {
              sx: { bgcolor: "#fff", color: theme.palette.grey[700] },
            },
          }}
        >
          <HelpIcon color={"info"} sx={{ ml: 2 }} />
        </Tooltip>
      </Box>
    </Box>
  );
}

const getConnections = (
  mapItems: {
    [row: number]: { [col: number]: { type: SECTOR_HEX_TYPES | undefined } };
  },
  row: number,
  col: number
) => {
  const isEvenRow = row % 2 === 0;

  // Default connections
  const connections: SectorHexagonProps["pathConnections"] = {
    topLeft: false,
    topRight: false,
    left: false,
    right: false,
    bottomLeft: false,
    bottomRight: false,
  };

  // Check if there is a hexagon in the given direction
  const hasHexagon = (r: number, c: number): boolean => {
    return !!mapItems[r]?.[c]?.type;
  };

  if (isEvenRow) {
    connections.topLeft = hasHexagon(row - 1, col - 1);
    connections.topRight = hasHexagon(row - 1, col);
    connections.left = hasHexagon(row, col - 1);
    connections.right = hasHexagon(row, col + 1);
    connections.bottomLeft = hasHexagon(row + 1, col - 1);
    connections.bottomRight = hasHexagon(row + 1, col);
  } else {
    connections.topLeft = hasHexagon(row - 1, col);
    connections.topRight = hasHexagon(row - 1, col + 1);
    connections.left = hasHexagon(row, col - 1);
    connections.right = hasHexagon(row, col + 1);
    connections.bottomLeft = hasHexagon(row + 1, col);
    connections.bottomRight = hasHexagon(row + 1, col + 1);
  }

  return connections;
};
