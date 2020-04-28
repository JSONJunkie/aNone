import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: theme.spacing(10),
    marginBottom: theme.spacing(1)
  },
  icons: {
    marginLeft: "auto"
  }
}));

const CommentCard = ({ data: { author, comment } }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6">{author}</Typography>
        <Typography variant="body2">{comment}</Typography>
      </CardContent>
      <CardActions>
        <IconButton className={classes.icons} size="small">
          <ThumbUpIcon />
        </IconButton>
        <IconButton size="small">
          <ThumbDownIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

CommentCard.propTypes = {
  data: PropTypes.object.isRequired
};

export default CommentCard;
