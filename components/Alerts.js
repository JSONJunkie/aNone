import { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";

import { clear } from "../src/actions/feed";

const useStyles = makeStyles(theme => ({
  alert: {
    position: "absolute",
    left: theme.spacing(0),
    right: theme.spacing(0)
  }
}));

const Alerts = ({ feed: { actionError }, clear, rollbar }) => {
  const classes = useStyles();

  const [badAlert, setBadAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (actionError) {
      window.scrollTo(0, 0);
      handleError(actionError);
    }
  }, [actionError]);

  const handleError = message => {
    setErrorMessage(prev => message);
    setBadAlert(prev => true);
    clear({ rollbar });
  };

  const handleClose = () => {
    setBadAlert(prev => false);
    setErrorMessage(prev => "");
  };

  return (
    <Container className={classes.alert}>
      <Collapse in={badAlert}>
        <Alert
          severity="error"
          variant="filled"
          onClose={() => {
            handleClose();
          }}
        >
          {errorMessage}
        </Alert>
      </Collapse>
    </Container>
  );
};

Alerts.propTypes = {
  feed: PropTypes.object.isRequired,
  clear: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  feed: state.feed
});

export default connect(mapStateToProps, { clear })(Alerts);
