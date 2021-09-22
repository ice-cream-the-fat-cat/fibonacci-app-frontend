import { Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import { CustomSpinner } from "../../components/LoadingWrapper/CustomSpinner";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import { createStyles, makeStyles } from "@material-ui/styles";
import { formatISO, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { Head } from "../../components/Head";
import { LoadingWrapper } from "../../components/LoadingWrapper";
import { Section } from "../../components/Section";
import { SectionTitle } from "../../components/SectionTitle";
import { deleteCompletedTask } from "../../helpers/api/completedTasks/deleteCompletedTask";
import {
  CompletedTaskToSend,
  sendCompletedTask,
} from "../../helpers/api/completedTasks/sendCompletedTask";
import { getGardenByGardenId } from "../../helpers/api/gardens/getGardenByGardenId";
import { CompletedTask } from "../../models/completedTask.model";
import { Rule } from "../../models/rule.model";
import { usePageState } from "../../store/page/usePageState";
import { useUserState } from "../../store/user/useUserState";
import { useApi } from "../../utils/api/useApi";
import wateringAnimation from "./assets/watering.gif";
import styles from "./DailyGardening.module.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    taskDescription: {
      width: "100%",
    },
    ruleButton: {
      margin: "2%",
    },
    returnButton: {
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.background.default,
      "&:hover": {
        backgroundColor: "#172F4ABB",
        color: theme.palette.background.paper,
      },
    },
  })
);

export const DailyGardening = () => {
  const history = useHistory();
  const { userData, setUserData } = useUserState();
  const { gardenId } = useParams<{ gardenId: string }>();
  const [showDescriptions, setShowDescriptions] = useState(false);
  const { setCurrentPage } = usePageState();
  const [gardenDataApi, getGardenData] = useApi(getGardenByGardenId);
  const [completedTaskApi, sendCompletedTaskData] = useApi(sendCompletedTask);
  const [deletedTaskApi, deleteTask] = useApi(deleteCompletedTask);

  const [lastClicked, setLastClicked] = useState("");

  const userId = useMemo(
    () => (userData.isLoggedIn ? userData.id : ""),
    [userData]
  );
  const [currentCompletedTasks, setCurrentCompletedTasks] = useState<
    CompletedTask[]
  >([]);

  useEffect(() => {
    if (gardenDataApi.status === "succeeded") {
      gardenDataApi.response.completedTasks &&
        setCurrentCompletedTasks(gardenDataApi.response.completedTasks);
    }
  }, [gardenDataApi]);

  const rules = useMemo(
    () => gardenDataApi.response?.rules ?? [],
    [gardenDataApi]
  );

  const isRuleCompleted = useCallback(
    (ruleId?: string) => {
      if (!currentCompletedTasks || !ruleId) return false;

      return currentCompletedTasks.some((completedTask) => {
        return (
          isSameDay(new Date(), new Date(completedTask.date)) &&
          completedTask.ruleId === ruleId
        );
      });
    },
    [currentCompletedTasks]
  );

  useEffect(() => {
    if (gardenId) {
      const dateISO: string = formatISO(new Date(), {
        representation: "date",
      });
      getGardenData(gardenId, dateISO);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  const completeTaskHandler = useCallback(
    async (rule: Rule) => {
      if (rule._id) {
        setLastClicked(rule._id);
      }
      const localeDate = new Date();
      const utcDate = new Date(
        Date.UTC(
          localeDate.getFullYear(),
          localeDate.getMonth(),
          localeDate.getDate(),
          0,
          0,
          0,
          0
        )
      );
      const completedTask: CompletedTaskToSend = {
        ruleId: rule._id || "",
        fireBaseUserId: userId,
        date: utcDate.toISOString(),
        rewardTypeId: "61274429d20570644762b99b",
      };

      sendCompletedTaskData(completedTask);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userData]
  );

  const removeCompletedTask = useCallback(
    async (rule: Rule) => {
      if (rule._id) {
        setLastClicked(rule._id);
      }

      const taskToDelete = currentCompletedTasks.find(
        (completedTask) =>
          completedTask.ruleId === rule._id &&
          isSameDay(new Date(), new Date(completedTask.date))
      );

      if (taskToDelete && userId) {
        // will return updated coins for users
        await deleteTask(taskToDelete._id, userId);
      }
    },
    [currentCompletedTasks, deleteTask, userId]
  );

  const onTaskClicked = useCallback(
    async (rule: Rule, isRuleCompleted: boolean) => {
      if (!isRuleCompleted) {
        completeTaskHandler(rule);
      } else {
        removeCompletedTask(rule);
      }
    },
    [completeTaskHandler, removeCompletedTask]
  );

  useEffect(() => {
    if (completedTaskApi.status === "succeeded") {
      // MEMO: Return also deleted task id and not just user account data
      const { balance: newCoinBalance } = completedTaskApi.response.user;
      setCurrentCompletedTasks((v) => [
        ...v,
        completedTaskApi.response.completedTask,
      ]);
      setUserData((data) => {
        return { ...data, balance: newCoinBalance };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedTaskApi]);

  useEffect(() => {
    if (deletedTaskApi.status === "succeeded") {
      const { balance: newCoinBalance } = deletedTaskApi.response;

      setCurrentCompletedTasks((tasks) =>
        tasks.filter((completedTask) => completedTask.ruleId !== lastClicked)
      );

      setUserData((data) => {
        return { ...data, balance: newCoinBalance };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedTaskApi]);

  const classes = useStyles();

  const isTaskHandlerApiLoading = useMemo(
    () =>
      completedTaskApi.status === "loading" ||
      deletedTaskApi.status === "loading",
    [completedTaskApi.status, deletedTaskApi.status]
  );
  return (
    <>
      <Head title="Daily Gardening" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0 }}
      >
        <Section>
          <SectionTitle title="Daily Gardening">
            <Button
              color="primary"
              variant="outlined"
              onClick={() => history.push(`/user/myniwa/${gardenId}/settings`)}
              className={styles.settingsButton}
            >
              Edit Garden
            </Button>
          </SectionTitle>
          <div className={styles.gardenViewContainer}>
            <div className={styles.wateringAnimationContainer}>
              <img
                src={wateringAnimation}
                alt="watering animation"
                className={styles.wateringAnimation}
              />
            </div>

            <div className={styles.rulesContainer}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                className={styles.heading}
              >
                <h2 className={styles.subtitle}>Daily Goals:</h2>

                {rules.length > 0 && (
                  <div className={styles.switchWrapper}>
                    <Switch
                      checked={showDescriptions}
                      color="primary"
                      onChange={() => setShowDescriptions((status) => !status)}
                      name="detailView"
                    />
                    <p>View Details</p>
                  </div>
                )}
              </Grid>

              <LoadingWrapper isLoading={!gardenDataApi.isLoaded}>
                <div className={styles.taskButtonContainer}>
                  {rules.map((rule) => {
                    return (
                      <div key={rule._id}>
                        <div className={styles.taskCheckboxWrapper}>
                          <FormControlLabel
                            disabled={isTaskHandlerApiLoading}
                            control={
                              <Checkbox
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTaskClicked(
                                    rule,
                                    isRuleCompleted(rule._id)
                                  );
                                }}
                                color="primary"
                                checked={isRuleCompleted(rule._id)}
                              />
                            }
                            label={rule.name}
                          />
                          {lastClicked === rule._id &&
                            isTaskHandlerApiLoading && (
                              <CustomSpinner isSmall />
                            )}
                        </div>
                        {rule.description && showDescriptions && (
                          <Card className={classes.taskDescription}>
                            <p className={styles.ruleDescription}>
                              {showDescriptions && rule.description}
                            </p>
                          </Card>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.returnButtonWrapper}>
                  <Button
                    variant="contained"
                    className={classes.returnButton}
                    onClick={() => {
                      history.push("/user/myniwa");
                      setCurrentPage("/user/myniwa");
                    }}
                  >
                    Go back to My Gardens
                  </Button>
                </div>
              </LoadingWrapper>
            </div>
          </div>
        </Section>
      </motion.div>
    </>
  );
};
