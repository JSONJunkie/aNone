import { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";

import { db } from "../services/firebase";
import CommentInput from "../components/CommentInput";
import CommentCard from "../components/CommentCard";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1
  },
  tabs: {
    marginBottom: theme.spacing(1)
  }
}));

function Index({ rollbar }) {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);

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
        <Container className={classes.content}>
          <Paper>
            <Tabs
              className={classes.tabs}
              value={1}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              centered
            >
              <Tab label="All" />
              <Tab label="State" />
              <Tab label="Local" />
            </Tabs>
          </Paper>
          <CommentInput rollbar={rollbar} />
          {posts &&
            posts.map(comment => (
              <CommentCard key={comment.id} data={comment} />
            ))}
        </Container>
      </div>
    </Fragment>
  );
}

Index.propTypes = {
  rollbar: PropTypes.object.isRequired
};

export default connect(null)(Index);
