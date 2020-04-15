import allComments from "../../comments.json";

export default (req, res) => {
  res.status(200).json(allComments);
};
