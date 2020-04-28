import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import Alerts from "./Alerts";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(1)
  }
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

const Navbar = ({ rollbar }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <HideOnScroll>
        <AppBar position="fixed">
          <Toolbar>
            <Typography>aNone</Typography>
            <Alerts rollbar={rollbar} />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar className={classes.root} />
    </Fragment>
  );
};

Navbar.propTypes = {
  rollbar: PropTypes.object.isRequired
};

export default Navbar;
