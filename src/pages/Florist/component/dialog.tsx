import React from "react";
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import { Flower } from "../../../models/flower.model";
import CoinAsset from "../assets/coin.png";
import styles from "../Florist.module.css";

interface AlertDialogProps {
  selectFlower: Flower;
  buyFlowerHandler: (flowerid: string, flowerprice: number) => void;
  cancelHandler: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: "fit-content",
    },
    dialog: {
      textAlign: "center",
    },
    confirmText: {
      fontSize: "1rem",
    },
    priceText: {
      fontSize: "1.2rem",
      lineHeight: "1.4rem",
      textAlign: "center",
      fontWeight: "bold",
      marginLeft: ".2rem",
    },
    confirmButton: {
      alignItems: "center",
      justifyContent: "space-around",
    },
  })
);

const DialogTitle = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogTitle);

export const AlertDialog: React.FC<AlertDialogProps> = ({
  selectFlower,
  buyFlowerHandler,
  cancelHandler,
}) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    cancelHandler();
  };

  const buy = () => {
    buyFlowerHandler(selectFlower._id, selectFlower.price);
    setOpen(false);
    cancelHandler();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className={classes.confirmText}>
        Are you sure you want to buy this flower?
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        <img
          src={selectFlower.imageURL}
          alt={"secret flower pic"}
          className={styles.notBoughtPicDialog}
        />
        <Grid container justifyContent="center" className={styles.coinlabel}>
          <img src={CoinAsset} alt="" className={styles.coin} />
          <DialogContentText className={classes.priceText}>
            {selectFlower.price}
          </DialogContentText>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.confirmButton}>
        <Button onClick={handleClose} color="primary">
          No, thank you
        </Button>
        <Button variant="contained" onClick={buy} color="primary" autoFocus>
          Yes, Please!
        </Button>
      </DialogActions>
    </Dialog>
  );
};
