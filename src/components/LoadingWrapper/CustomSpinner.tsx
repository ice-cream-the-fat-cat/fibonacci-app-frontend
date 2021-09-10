import { motion } from "framer-motion";
import { ReactComponent as NiwaFlower } from "./assets/myniwa.svg";
import styles from "./CustomSpinner.module.css";

export const CustomSpinner = () => {
  return (
    <motion.div
      animate={{
        rotate: 360,
        backgroundColor: [
          "#3b727080",
          "#6ac69780",
          "#87D1AB80",
          "#edf4f580",
          "#87D1AB80",
          "#6ac69780",
          "#3b727080",
        ],
      }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className={
        styles.spinnerContainer
      }
    >
      <NiwaFlower className={styles.spinner} />
    </motion.div>
  );
};
