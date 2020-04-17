import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import fetch from "isomorphic-unfetch";
import PropTypes from "prop-types";
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
function Index({ data }) {
  const classes = useStyles();

  const [text, setText] = useState("");

  const handleText = e => {
    setText(e.target.value);
  };

  const handleSend = e => {
    send(text);
  };

  return (
    <Fragment>
      <div className={classes.root}>
        <Container className={classes.content}>
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
                className={classes.inputButton}
                color="primary"
                variant="contained"
                fullWidth
              >
                Send!
              </Button>
            </Grid>
          </Grid>
          {data.map(comment => (
            <CommentCard key={comment._id} data={comment} />
          ))}
        </Container>
      </div>
    </Fragment>
  );
}

Index.getInitialProps = async function () {
  const dev = process.env.NODE_ENV !== "production";

  const baseUrl = dev
    ? "http://localhost:3000"
    : "http://drees1992-anone.herokuapp.com";
  const res = await fetch(baseUrl + "/api/test");
  const data = await res.json();

  return { data };
};

Index.propTypes = {
  send: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { send })(Index);
