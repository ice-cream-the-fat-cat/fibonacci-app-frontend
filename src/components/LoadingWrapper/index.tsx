import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import { CustomSpinner } from "./CustomSpinner";
import styles from "./LoadingWrapper.module.css";

export const LoadingWrapper: React.FC<{ isLoading: boolean }> = ({
  children,
  isLoading,
}) => {
  return (
    <>
      {isLoading ? (
        <div className={styles.wrapper}>
          {/* <CircularProgress /> */}
          <CustomSpinner />
        </div>
      ) : (
        children
      )}
    </>
  );
};
