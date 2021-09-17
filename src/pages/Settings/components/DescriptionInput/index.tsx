import { createStyles, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import {
  GardenUpdateParams,
  updateGardenData,
} from "../../../../helpers/api/gardens/updateGardenData";
import { useApi } from "../../../../utils/api/useApi";
import styles from "./DescriptionInput.module.css";

type Props = {
  showInput: boolean;
  currentGardenDescription: string;
  initialGardenDescription: string;
  onDescriptionInputChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  setShowDescriptionInput: React.Dispatch<React.SetStateAction<boolean>>;
  setGardenDescription: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  updateInitVal: React.Dispatch<React.SetStateAction<string | undefined>>;
  gardenId: string;
  updateData: GardenUpdateParams["data"];
};

const useStyles = makeStyles(() =>
  createStyles({
    buttonWrapper: {
      position: "relative",
      display: "inline-block",
      marginLeft: 15,
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

export const DescriptionInput: React.FC<Props> = memo(
  ({
    currentGardenDescription,
    initialGardenDescription,
    onDescriptionInputChange,
    setShowDescriptionInput,
    setGardenDescription,
    gardenId,
    updateData,
    showInput,
    updateInitVal,
  }) => {
    const classes = useStyles();
    const [updateGardenApi, updateGardenInfo] = useApi(updateGardenData);

    const disableUpdate = useMemo(
      () =>
        initialGardenDescription === currentGardenDescription ||
        updateGardenApi.status === "loading",
      [
        initialGardenDescription,
        currentGardenDescription,
        updateGardenApi.status,
      ]
    );

    const updateGarden = useCallback(
      async () => {
        updateGardenInfo({
          gardenId,
          data: { ...updateData, description: currentGardenDescription },
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [gardenId, currentGardenDescription, updateData]
    );

    const onCancel = useCallback(() => {
      setShowDescriptionInput(false);
      setGardenDescription(initialGardenDescription);
    }, [
      initialGardenDescription,
      setGardenDescription,
      setShowDescriptionInput,
    ]);

    const onEdit = useCallback(() => {
      setShowDescriptionInput(true);
    }, [setShowDescriptionInput]);

    useEffect(() => {
      if (updateGardenApi.status === "succeeded") {
        setShowDescriptionInput(false);
        updateInitVal(updateGardenApi.response.description || "-");
      }
    }, [setShowDescriptionInput, updateGardenApi, updateInitVal]);

    return (
      <>
        <TextField
          label="Garden Description"
          variant={showInput ? "outlined" : undefined}
          className={styles.descriptionInput}
          value={currentGardenDescription}
          onChange={onDescriptionInputChange}
          disabled={updateGardenApi.status === "loading"}
          placeholder="Add a Garden Description"
          InputProps={{
            readOnly: !showInput,
          }}
        />
        <div className={styles.descriptionInputButtons}>
          {showInput ? (
            <>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={updateGardenApi.status === "loading"}
              >
                Cancel
              </Button>

              <div className={classes.buttonWrapper}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={updateGarden}
                  disabled={disableUpdate}
                >
                  Update
                </Button>
                {updateGardenApi.status === "loading" && (
                  <CircularProgress
                    size={28}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </>
          ) : (
            <Button color="primary" variant="contained" onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>
      </>
    );
  }
);
