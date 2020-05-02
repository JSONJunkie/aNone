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

function Index({
  feed: { geoFailStatus, location, lat, long, userCity, userState, loading },
  storePos,
  geoFail,
  rollbar
}) {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("all");
  const [postsLoading, setPostsLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [geoStatus, setGeoStatus] = useState("");

  const handlePos = pos => {
    const crd = {
      latitude: pos.coords.latitude.toString(),
      longitude: pos.coords.longitude.toString()
    };

    if (lat === crd.latitude && long === crd.longitude) {
    } else {
      storePos({ crd, rollbar });
    }
  };

  const error = err => {
    // console.warn(`ERROR(${err.code}): ${err.message}`);
    console.log(err);
    geoFail({ rollbar });
  };

  const handleChange = (event, newValue) => {
    setTab(prev => newValue);
    if (newValue !== tab) {
      setPostsLoading(prev => true);
    }
  };

  useEffect(() => {
    try {
      if (navigator.permissions.query) {
        (async () => {
          const status = await navigator.permissions.query({
            name: "geolocation"
          });
          if (status.state === "prompt") {
            setGeoStatus(prev => "prompt");
          }
          if (status.state === "granted") {
            setGeoStatus(prev => "granted");
            if (typeof window !== "undefined") {
              navigator.geolocation.getCurrentPosition(
                handlePos,
                error,
                options
              );
            }
          }
          if (status.state === "denied") {
            setGeoStatus(prev => "denied");
          }
        })();
      } else {
        setGeoStatus(prev => "n/a");
      }
    } catch (e) {
      rollbar.error(e);
    }
  }, [location, geoFailStatus]);

  useEffect(() => {
    try {
      if (tab === "state" || tab === "local") {
        if (typeof window !== "undefined") {
          navigator.geolocation.getCurrentPosition(handlePos, error, options);
        }
      }
    } catch (e) {
      rollbar.error(e);
    }
  }, [tab]);

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
            setPostsLoading(prev => false);
          });
      }
      if (tab === "state") {
        if (!location) {
          setPosts(prev => []);
          setPostsLoading(prev => false);
        }
        if (location) {
          db.ref("comments")
            .orderByChild("userState")
            .equalTo(userState)
            .on("value", snapshot => {
              let chats = [];
              snapshot.forEach(snap => {
                chats.push(snap.val());
              });
              setPosts(prev => chats.reverse());
              setPostsLoading(prev => false);
            });
        }
      }
      if (tab === "local") {
        if (!location) {
          setPosts(prev => []);
          setPostsLoading(prev => false);
        }
        if (location) {
          db.ref("comments")
            .orderByChild("userCity")
            .equalTo(userCity)
            .on("value", snapshot => {
              let chats = [];
              snapshot.forEach(snap => {
                chats.push(snap.val());
              });
              setPosts(prev => chats.reverse());
              setPostsLoading(prev => false);
            });
        }
      }
    } catch (e) {
      console.log(e);
      rollbar.error(e);
    }
  }, [tab, location]);

  useEffect(() => {
    if (!postsLoading) {
      if (!loading || geoStatus === "n/a") {
        setPageLoading(false);
      }
    }
  }, [postsLoading, loading]);

  return pageLoading ? (
    <Grid container justify="center" alignItems="center">
      <CircularProgress disableShrink={true} className={classes.loader} />
    </Grid>
  ) : (
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
          <CommentInput geo={{ error, options, geoStatus }} rollbar={rollbar} />
          {postsLoading ? (
            <Grid container justify="center" alignItems="center">
              <CircularProgress
                disableShrink={true}
                className={classes.loader}
              />
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
  feed: PropTypes.object.isRequired,
  storePos: PropTypes.func.isRequired,
  geoFail: PropTypes.func.isRequired,
  rollbar: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  feed: state.feed
});

export default connect(mapStateToProps, { storePos, geoFail })(Index);
