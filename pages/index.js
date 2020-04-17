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

import CommentCard from "../components/CommentCard";
import { send } from "../src/actions/feed";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(10)
  },
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  inputButton: {
    height: "100%"
  }
}));

function fetcher(url) {
  return axios.get(url);
}
function Index({ send, sent }) {
  const classes = useStyles();

  const { data, error } = useSWR("/api/test", fetcher);
  // console.log(data);
  // console.log(data && data.data);
  // console.log(error);

  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);

  const handleText = e => {
    setText(e.target.value);
  };

  const handleSend = e => {
    // e.preventDefault();
    send(text);
  };

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
        <Container className={classes.content}>
          {/* <form onSubmit={e => handleSend(e)}> */}
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
                // type="submit"
                className={classes.inputButton}
                color="primary"
                variant="contained"
                onClick={e => handleSend(e)}
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
          {/* </form> */}
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
  sent: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  sent: state.feed.sent
});

export default connect(mapStateToProps, { send })(Index);
