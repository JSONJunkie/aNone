import { useRouter } from "next/router";
// import useSWR from "swr";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import fetch from "isomorphic-unfetch";

import CommentCard from "../components/CommentCard";
import { Fragment } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(10)
  }
}));

// function fetcher(url) {
//   return fetch(url).then(r => r.json());
// }

Feed.getInitialProps = async function (context) {
  // const { data, error } = useSWR(`/api/commentStream`, fetcher);
  // console.log(context);
  // const { req } = context;
  // console.log(req);
  // const baseURL = req ? `${req.protocol}://${req.headers.host}` : "";
  // const res = await fetch(baseURL + "/test");
  const res = await fetch("http://localhost:3000/api/commentStream");

  const data = await res.json();
  console.log(data);
  return { data };
};

export default function Feed() {
  const classes = useStyles();

  // return (
  //   <main className="center">
  //     <div className="quote">{quote}</div>
  //     {author && <span className="author">- {author}</span>}
  //   </main>
  // );

  return (
    <Fragment>
      <div className={classes.root}>
        <Container className={classes.content}>
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
        </Container>
      </div>
    </Fragment>
  );
}
