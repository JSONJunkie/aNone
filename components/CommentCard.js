import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles(theme => ({
  root: {
    // display: "flex",
    minHeight: theme.spacing(10),
    marginBottom: theme.spacing(2)
  },
  content: {
    flexGrow: 1
  }
}));

const CommentCard = () => {
  const classes = useStyles();

  return <Card className={classes.root}>Hello</Card>;
};

export default CommentCard;
