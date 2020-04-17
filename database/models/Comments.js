import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

export default CommentsSchema;
