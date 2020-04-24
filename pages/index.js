import { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import useSWR from "swr";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";

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

function Index({ feed: { sent, actionError }, send, clear, rollbar }) {
  const classes = useStyles();

  const { data, error } = useSWR("/api/test", url => {
    try {
      return axios.get(url);
    } catch (e) {
      if (e.response) {
        const errors = e.response.data.errors;
        if (errors) {
          throw new Error(errors.message);
        }
      }
    }
  });

  if (error) {
    console.log(error);
  }

  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  const [badAlert, setBadAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setText(e.target.value);
  };

  const handleSend = e => {
    e.preventDefault();
    send({ text, rollbar });
    // throw new Error("test");
    // console.log(rollbar);
    // rollbar.error("hello");
  };

  useEffect(() => {
    if (actionError) {
      handleError(actionError);
    }
  }, [actionError]);

  useEffect(() => {
    if (data) {
      setPosts(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (sent.comment) {
      setPosts([sent, ...posts]);
    }
  }, [sent]);

  return (
    <Fragment>
      <div className={classes.root}>
        <Container className={classes.alert}>
          {/* <Collapse in={goodAlert}>
            <Alert severity="success">Translated text saved!</Alert>
          </Collapse> */}
          <Collapse in={badAlert}>
            <Alert severity="error">{errorMessage}</Alert>
          </Collapse>
        </Container>

        <Container className={classes.content}>
          <form onSubmit={e => handleSend(e)}>
            <Grid container className={classes.input}>
              <Grid item xs={12} sm>
                <TextField
                  name="input"
                  variant="outlined"
                  placeholder="Say something..."
                  onChange={e => handleText(e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm="auto">
                <Button
                  type="submit"
                  className={classes.inputButton}
                  color="primary"
                  variant="contained"
                  // onClick={e => handleSend(e)}
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

// Index.getInitialProps = async function () {
//   const dev = process.env.NODE_ENV !== "production";

//   const baseUrl = dev
//     ? "http://localhost:3000"
//     : "http://drees1992-anone.herokuapp.com";
//   const res = await fetch(baseUrl + "/api/test");
//   const data = await res.json();

//   return { data };
// };

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
