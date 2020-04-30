import { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";

import { db } from "../services/firebase";
import CommentInput from "../components/CommentInput";
import CommentCard from "../components/CommentCard";
import { storePos, geoFail } from "../src/actions/feed";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1
  },
  tabs: {
    marginBottom: theme.spacing(1)
  },
  loader: {
    marginTop: theme.spacing(10)
  }
}));

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function Index({ feed: { sent, location }, storePos, geoFail, rollbar }) {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const handlePos = pos => {
    const crd = {
      latitude: pos.coords.latitude.toString(),
      longitude: pos.coords.longitude.toString()
    };
    storePos({ crd, rollbar });
  };

  const error = err => {
    // console.warn(`ERROR(${err.code}): ${err.message}`);
    geoFail({ rollbar });
  };

  const handleChange = (event, newValue) => {
    setTab(prev => newValue);
    setLoading(prev => true);
  };

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
      if (tab === "all") {
        db.ref("comments")
          .orderByChild("timestamp")
          .on("value", snapshot => {
            let chats = [];
            snapshot.forEach(snap => {
              chats.push(snap.val());
            });
            setPosts(prev => chats.reverse());
            setLoading(prev => false);
          });
      }
      if (tab === "state") {
        if (!location) {
          setPosts(prev => []);
          setLoading(prev => false);
        }
        if (location) {
          db.ref("comments")
            .orderByChild("timestamp")
            .on("value", snapshot => {
              let chats = [];
              snapshot.forEach(snap => {
                chats.push(snap.val());
              });
              setPosts(prev => chats.reverse());
              setLoading(prev => false);
            });
        }
      }
      if (tab === "local") {
        if (!location) {
          setPosts(prev => []);
          setLoading(prev => false);
        }
        if (location) {
          db.ref("comments")
            .orderByChild("timestamp")
            .on("value", snapshot => {
              let chats = [];
              snapshot.forEach(snap => {
                chats.push(snap.val());
              });
              setPosts(prev => chats.reverse());
              setLoading(prev => false);
            });
        }
      }
    } catch (e) {
      rollbar.error(e);
    }
  }, [tab]);

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
              <Tab label="All" value="all" />
              <Tab label="State" value="state" />
              <Tab label="Local" value="local" />
            </Tabs>
          </Paper>
          <CommentInput rollbar={rollbar} />
          {loading ? (
            <Grid container justify="center" alignItems="center">
              <CircularProgress className={classes.loader} />
            </Grid>
          ) : (
            <Fragment>
              {posts.length > 0 ? (
                posts.map(comment => (
                  <CommentCard key={comment.id} data={comment} />
                ))
              ) : (
                <Grid container justify="center" alignItems="center">
                  <Typography>
                    Not able to retrieve {tab} posts. Please be sure to enable
                    location for your browser/device.
                  </Typography>
                </Grid>
              )}
            </Fragment>
          )}
        </Container>
      </div>
    </Fragment>
  );
}

Index.propTypes = {
  storePos: PropTypes.func.isRequired,
  geoFail: PropTypes.func.isRequired,
  rollbar: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  feed: state.feed
});

export default connect(mapStateToProps, { storePos, geoFail })(Index);
