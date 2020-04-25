import { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import { useForm } from "react-hook-form";

import { db } from "../services/firebase";
import CommentCard from "../components/CommentCard";
import { send, clear } from "../src/actions/feed";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(10)
  },
  alert: {
    position: "absolute",
    top: theme.spacing(10),
    left: theme.spacing(0),
    right: theme.spacing(0)
  },
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

function Index({ feed: { actionError }, send, clear, rollbar }) {
  const { register, handleSubmit, errors, setValue, watch } = useForm({
    defaultValues
  });

  const classes = useStyles();

  const selectValue = watch("input");
  const [posts, setPosts] = useState([]);
  const [badAlert, setBadAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validateError, setValidateError] = useState("");
  const [isValidateError, setIsValidateError] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleError = message => {
    setErrorMessage(prev => message);
    setBadAlert(prev => true);
    setTimeout(() => {
      setBadAlert(prev => false);
      setErrorMessage(prev => "");
    }, 5000);
    clear({ rollbar });
  };

  const handleText = e => {
    setValue("input", e.target.value);
  };

  const handleSend = () => {
    send({ text: selectValue, rollbar });
    setResetting(prev => true);
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
    if (actionError) {
      handleError(actionError);
    }
  }, [actionError, errors.input]);

  useEffect(() => {
    try {
      db.ref("comments")
        .orderByChild("timestamp")
        .on("value", snapshot => {
          let chats = [];
          snapshot.forEach(snap => {
            chats.push(snap.val());
          });
          setPosts(prev => chats.reverse());
        });
    } catch (e) {
      rollbar.error(e);
    }
  }, []);

  return (
    <Fragment>
      <div className={classes.root}>
        <Container className={classes.alert}>
          <Collapse in={badAlert}>
            <Alert severity="error">{errorMessage}</Alert>
          </Collapse>
        </Container>
        <Container className={classes.content}>
          <form onSubmit={handleSubmit(handleSend)}>
            <Grid container className={classes.input}>
              <Grid item xs={12} sm>
                <TextField
                  name="input"
                  value={selectValue}
                  variant="outlined"
                  placeholder="What's on your mind?"
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
                />
              </Grid>
              <Grid item xs={12} sm="auto">
                <Button
                  type="submit"
                  className={classes.inputButton}
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  Send!
                </Button>
              </Grid>
            </Grid>
            {posts &&
              posts.map(comment => (
                <CommentCard key={comment.id} data={comment} />
              ))}
          </form>
        </Container>
      </div>
    </Fragment>
  );
}

Index.propTypes = {
  send: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  feed: PropTypes.object.isRequired,
  rollbar: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  feed: state.feed
});

export default connect(mapStateToProps, { send, clear })(Index);
