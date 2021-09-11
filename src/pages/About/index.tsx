import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { motion } from "framer-motion";
import { useHistory } from "react-router";
import { SignIn } from "../../components/SignIn";
import { useUserState } from "../../store/user/useUserState";
import styles from "./About.module.css";
import gardenPhoto from "./assets/garden.gif";

const useStyles = makeStyles({
  root: {
    opacity: 0.8,
  },
  media: {
    height: "40vh",
  },
});

export const About = () => {
  const { userData } = useUserState();

  const classes = useStyles();

  const history = useHistory();
  const linkHandler = () => {
    history.push("/user/myniwa");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
      className={styles.infoPage}
    >
      <div className={styles.aboutPage}>
        <div>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={gardenPhoto}
                title=""
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  My Niwa is about growing a beautiful garden
                </Typography>
                <Typography component="div">
                  <ol>
                    <li>
                      Create a flower bed with seeds (good habits you'd like to
                      have!)
                    </li>
                    <li>Every day, complete your seeds to gain coins!</li>
                    <li>Use your coins to either buy flowers at the store</li>
                    {/* <li>Or try your luck with the gacha for rare flowers!</li> */}
                    <li>
                      Try to collect all the flowers while bettering yourself!
                    </li>
                  </ol>
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {userData.isLoggedIn ? (
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => linkHandler()}
                  className={styles.toMyNiwa}
                >
                  Get me to my niwa!
                </Button>
              ) : (
                <SignIn />
              )}
            </CardActions>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
