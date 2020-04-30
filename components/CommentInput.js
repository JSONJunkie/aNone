import { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";

import { send } from "../src/actions/feed";

const useStyles = makeStyles(theme => ({
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  inputButton: {
    height: "100%"
  }
}));

const defaultValues = {
  input: ""
};

const CommentInput = ({
  feed: { location, lat, long },
  send,
  rollbar,
  geo: { handlePos, error, options, geoStatus }
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors, setValue, watch } = useForm({
    defaultValues
  });

  const selectValue = watch("input");
  const [validateError, setValidateError] = useState("");
  const [isValidateError, setIsValidateError] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleText = e => {
    setValue("input", e.target.value);
  };

  const handleSend = () => {
    // send({ text: selectValue, lat, long, rollbar });
    setResetting(prev => true);
  };

  const handleAllow = () => {
    if (typeof window !== "undefined") {
      navigator.geolocation.getCurrentPosition(handlePos, error, options);
    }
  };

  useEffect(() => {
    if (resetting) {
      setValue("input", "");
      setResetting(prev => false);
    }
  }, [resetting]);

  useEffect(() => {
    if (errors.input) {
      setValidateError(prev => errors.input.message);
      setIsValidateError(prev => true);
    } else {
      setValidateError(prev => "");
      setIsValidateError(prev => false);
    }
  }, [errors.input]);

  return (
    <form onSubmit={handleSubmit(handleSend)}>
      <Grid container className={classes.input}>
        {geoStatus === "prompt" ? (
          <Fragment>
            <Grid item xs={12} sm>
              <TextField
                name="input"
                value={selectValue}
                variant="outlined"
                placeholder="You must allow location to write a post"
                inputRef={register({
                  required: {
                    value: true,
                    message: "Please write something"
                  }
                })}
                autoFocus
                helperText={validateError}
                error={isValidateError}
                onChange={handleText}
                fullWidth
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button
                className={classes.inputButton}
                color="primary"
                variant="contained"
                fullWidth
                onClick={handleAllow}
              >
                Allow location
              </Button>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid item xs={12} sm>
              <TextField
                name="input"
                value={selectValue}
                variant="outlined"
                placeholder="You must allow location to write a post"
                inputRef={register({
                  required: {
                    value: true,
                    message: "Please write something"
                  }
                })}
                autoFocus
                helperText={validateError}
                error={isValidateError}
                onChange={handleText}
                fullWidth
                disabled={!location}
              />
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button
                type="submit"
                className={classes.inputButton}
                color="primary"
                variant="contained"
                fullWidth
                disabled={!location}
              >
                Send!
              </Button>
            </Grid>
          </Fragment>
        )}
      </Grid>
    </form>
  );
};

CommentInput.propTypes = {
  send: PropTypes.func.isRequired,
  rollbar: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  feed: state.feed
});

export default connect(mapStateToProps, { send })(CommentInput);
