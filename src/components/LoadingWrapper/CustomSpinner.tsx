import { motion } from "framer-motion";
import { ReactComponent as NiwaFlower } from "./assets/myniwa.svg";
import styles from "./CustomSpinner.module.css";

export const CustomSpinner = () => {
  return (
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
      className={
        styles.spinnerContainer
      }
    >
      <NiwaFlower className={styles.spinner} />
    </motion.div>
  );
};
