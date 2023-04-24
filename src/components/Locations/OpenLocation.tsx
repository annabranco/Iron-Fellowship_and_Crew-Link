import {
  Alert,
  AlertTitle,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LocationDocument } from "types/Locations.type";
import BackIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLayoutEffect, useRef, useState } from "react";
import { useUpdateLocation } from "api/worlds/locations/updateLocation";
import { useDeleteLocation } from "api/worlds/locations/deleteLocation";
import { useConfirm } from "material-ui-confirm";
import { SectionHeading } from "components/SectionHeading";
import { RichTextEditorNoTitle } from "components/RichTextEditor";
import { TextFieldWithOracle } from "components/TextFieldWithOracle/TextFieldWithOracle";
import { useDebouncedState } from "hooks/useDebouncedState";
import { LocationNameInput } from "./LocationNameInput";
import { useRoller } from "providers/DieRollProvider";
import { useAuth } from "providers/AuthProvider";
import { useUpdateLocationGMProperties } from "api/worlds/locations/updateLocationGMProperties";
import { DebouncedOracleInput } from "./DebouncedOracleInput";
import { LocationDocumentWithGMProperties } from "features/character-sheet/characterSheet.store";
import { RtcRichTextEditor } from "components/RichTextEditor/RtcRichTextEditor";
import { useUpdateLocationNotes } from "api/worlds/locations/updateLocationNotes";

export interface OpenLocationProps {
  worldOwnerId: string;
  worldId: string;
  locationId: string;
  location: LocationDocumentWithGMProperties;
  closeLocation: () => void;
  isSinglePlayer?: boolean;
}

export function OpenLocation(props: OpenLocationProps) {
  const {
    worldOwnerId,
    worldId,
    locationId,
    location,
    closeLocation,
    isSinglePlayer,
  } = props;

  const confirm = useConfirm();
  const { rollOracleTable } = useRoller();

  const uid = useAuth().user?.uid;
  const isWorldOwner = worldOwnerId === uid;

  const { updateLocation, loading } = useUpdateLocation();
  const { updateLocationGMProperties } = useUpdateLocationGMProperties();
  const { deleteLocation } = useDeleteLocation();
  const { updateLocationNotes } = useUpdateLocationNotes();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const initialLoadRef = useRef<boolean>(true);

  useLayoutEffect(() => {
    if (initialLoadRef.current && nameInputRef.current) {
      if (location.name === "New Location") {
        nameInputRef.current.select();
      }
      initialLoadRef.current = false;
    }
  }, [location]);

  const handleLocationDelete = () => {
    confirm({
      title: `Delete ${location.name}`,
      description:
        "Are you sure you want to delete this location? It will be deleted from ALL of your characters and campaigns that use this world. This cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteLocation({ worldOwnerId, worldId, locationId })
          .catch(() => {})
          .then(() => {
            closeLocation();
          });
      })
      .catch(() => {});
  };

  return (
    <Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          px: 1,
          py: 0.5,
        })}
      >
        <IconButton onClick={() => closeLocation()}>
          <BackIcon />
        </IconButton>
        <LocationNameInput
          inputRef={nameInputRef}
          initialName={location.name}
          updateName={(newName) =>
            updateLocation({
              worldOwnerId,
              worldId,
              locationId,
              location: { name: newName },
            }).catch(() => {})
          }
        />
        <IconButton onClick={() => handleLocationDelete()}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Container>
        <Grid
          container
          spacing={2}
          sx={{ mb: 2, mt: isSinglePlayer || !isWorldOwner ? 0 : -2 }}
        >
          {isWorldOwner && (
            <>
              {!isSinglePlayer && (
                <Grid item xs={12}>
                  <SectionHeading
                    label={"GM Only (Not shared with players)"}
                    breakContainer
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <DebouncedOracleInput
                  label={"Description"}
                  initialValue={location?.gmProperties?.descriptor ?? ""}
                  updateValue={(descriptor) =>
                    updateLocationGMProperties({
                      worldOwnerId,
                      worldId,
                      locationId,
                      locationGMProperties: { descriptor },
                    }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/place/descriptor"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DebouncedOracleInput
                  label={"Trouble"}
                  initialValue={location?.gmProperties?.trouble ?? ""}
                  updateValue={(trouble) => {
                    updateLocationGMProperties({
                      worldOwnerId,
                      worldId,
                      locationId,
                      locationGMProperties: { trouble },
                    });
                  }}
                  oracleTableId={"ironsworn/oracles/settlement/trouble"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DebouncedOracleInput
                  label={"Location Features"}
                  initialValue={location?.gmProperties?.locationFeatures ?? ""}
                  updateValue={(locationFeatures) => {
                    updateLocationGMProperties({
                      worldOwnerId,
                      worldId,
                      locationId,
                      locationGMProperties: { locationFeatures },
                    }).catch(() => {});
                  }}
                  oracleTableId={"ironsworn/oracles/place/location"}
                />
              </Grid>
              {!isSinglePlayer && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{ alignItems: "center", display: "flex" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={!location.hiddenFromPlayers}
                        onChange={(evt, value) =>
                          updateLocation({
                            worldOwnerId,
                            worldId,
                            locationId,
                            location: { hiddenFromPlayers: !value },
                          }).catch(() => {})
                        }
                      />
                    }
                    label="Visible to Players"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <RichTextEditorNoTitle
                  content={location.gmProperties?.notes ?? ""}
                  onSave={({ content }) =>
                    updateLocationGMProperties({
                      worldOwnerId,
                      worldId,
                      locationId,
                      locationGMProperties: { notes: content },
                    })
                  }
                />
              </Grid>
            </>
          )}
          {!isSinglePlayer && (
            <>
              {isWorldOwner && (
                <Grid item xs={12}>
                  <SectionHeading
                    label={
                      location.hiddenFromPlayers
                        ? "Public Notes (Once shared with players)"
                        : "Public Notes (Shared with players)"
                    }
                    breakContainer
                  />
                </Grid>
              )}
              {location.hiddenFromPlayers && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    These notes are not yet visible to players because this
                    location is hidden from them.
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                {(location.notes || location.notes === null) && (
                  <RtcRichTextEditor
                    documentId={`iron-fellowship-${worldOwnerId}-${locationId}`}
                    documentPassword={worldId}
                    onSave={(notes) =>
                      updateLocationNotes({
                        worldOwnerId,
                        worldId,
                        locationId,
                        notes,
                      })
                    }
                    initialValue={location.notes || undefined}
                  />
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
