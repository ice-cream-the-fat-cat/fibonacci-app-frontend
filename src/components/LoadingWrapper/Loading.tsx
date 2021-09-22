import { CustomSpinner } from "./CustomSpinner";
import styles from "./LoadingWrapper.module.css";

export const Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
      <CustomSpinner />
    </div>
  );
};
