// use mongoose Database.
const mongoose = require('mongoose');

//Define Table cols.
const sauceSchema = mongoose.Schema({

  //col Name - Type Data - validation 
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },//userId of user1 , userId of user2 .. // array of string
  usersDisliked: { type: [String] },
});
// create Table  Name( Sauce )
module.exports = mongoose.model('Sauce', sauceSchema);