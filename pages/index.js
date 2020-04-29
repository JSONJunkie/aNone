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
import { storePos, clear } from "../src/actions/feed";
import { set } from "mongoose";

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

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function Index({ feed: { sent, location }, storePos, clear, rollbar }) {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState(0);

  const handlePos = pos => {
    const crd = pos.coords;
    storePos({ crd, rollbar });
  };

  const error = err => {
    // console.warn(`ERROR(${err.code}): ${err.message}`);
    clear({ sent, rollbar });
  };

  const handleChange = (event, newValue) => {
    setTab(prev => newValue);
  };

  useEffect(() => {
    if (location) {
      setTab(prev => 2);
    }
  }, [location]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        navigator.geolocation.getCurrentPosition(handlePos, error, options);
      }
    } catch (e) {
      rollbar.error(e);
    }
  }, [sent]);

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
              value={tab}
              onChange={handleChange}
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
  storePos: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  rollbar: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  feed: state.feed
});

export default connect(mapStateToProps, { storePos, clear })(Index);
