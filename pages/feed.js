import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Navbar from "../components/Navbar";
import CommentCard from "../components/CommentCard";
import { Fragment } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    minHeight: "100vh"
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(5),
    background: "black"
  }
}));

export default function Feed() {
  const classes = useStyles();

  return (
    <Fragment>
      {/* <Navbar /> */}
      <div className={classes.root}>
        <Container className={classes.content}>
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
        </Container>
      </div>
    </Fragment>
  );
}
