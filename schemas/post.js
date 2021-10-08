const mongoose = require("mongoose");
const { Schema } = mongoose;

const rewriteSchema = new Schema({
  rebody:{
    type: String
  },
  date:{
    type: String 
  },
  username:{
    type: String
  },
  writeId:{
    type: Number
  },
});


const postSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    rewrite:{
      type: [rewriteSchema],
    },
});




module.exports = mongoose.model(`Post`, postSchema);
