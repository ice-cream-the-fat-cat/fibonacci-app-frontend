import { createStyles, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      margin: "1rem 0",
      width: "100%",
    },
  })
);

export const Title: React.FC<{ children?; title: string }> = ({
  children,
  title,
}) => {
  const classes = useStyles();
  return (
    <Grid className={classes.title} container justifyContent="space-between">
      <h1>{title}</h1>
      {children}
    </Grid>
  );
};
