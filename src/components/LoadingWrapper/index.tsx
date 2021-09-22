import React from "react";
import { CustomSpinner } from "./CustomSpinner";
import styles from "./LoadingWrapper.module.css";

export const LoadingWrapper: React.FC<{ isLoading: boolean, isSmall?: boolean }> = ({
  children,
  isLoading,
  isSmall
}) => {
  return (
    <>
      {isLoading ? (
        <div className={isSmall ? styles.smallWrapper : styles.wrapper}>
          <CustomSpinner isSmall={isSmall}/>
        </div>
      ) : (
        children
      )}
    </>
  );
};
