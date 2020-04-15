import { makeStyles } from "@material-ui/core/styles";
import { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";

const useStyles = makeStyles(theme => ({
  root: {
    // display: "flex",
    // height: theme.spacing(5)
    // position: "absolute",
    // top: "0px"
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(5)
    // background: "black"
  }
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.root}>
        <AppBar position="sticky">Hello</AppBar>
      </div>
    </Fragment>
  );
};

export default Navbar;
