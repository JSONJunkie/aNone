import express from "express";
import allComments from "../../comments.json";

const app = express();

const port = 2000;
app.listen(port);

app.get("/test", function (req, res) {
  res.send(allComments);
});
