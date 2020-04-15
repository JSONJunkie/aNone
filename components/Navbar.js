import { makeStyles } from "@material-ui/core/styles";
import { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    // display: "flex",
    // height: theme.spacing(5)
    // position: "absolute",
    // top: "0px"
  }
  // content: {
  //   flexGrow: 1,
  //   paddingTop: theme.spacing(5)
  // }
}));

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = props => {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.root}>
        <HideOnScroll {...props}>
          <AppBar position="fixed">
            <Toolbar>
              <Typography>aNone</Typography>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
      </div>
    </Fragment>
  );
};

export default Navbar;
