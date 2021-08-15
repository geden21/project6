const Sauce = require('../models/sauce');
const fs = require('fs');

//request (req) from the frontend

//result (res)
exports.createSauce = (req, res, next) => {
    
    //1- read data from the frontend/ request == req.body
    const sauceObject = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');

    //2- create new model with the data.
    const sauce = new Sauce({

        ...sauceObject,
        //colName : value

        //Path for the image
        imageUrl: url + '/images/' + req.file.filename,
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked : []
    });

    //3- Save the model in database
    sauce.save()

    //4- Result is success ( 200 - 201)
        .then(
            () => {
                res.status(201).json({
                    message: 'Post saved successfully!'
                });
            }
        )
        // Result is error ( 400)
        .catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    //model.....action....
  Sauce.findOne({
    _id: req.params.id
  })
  .then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  )
  .catch(
    (error) => { // 404 Not found Error
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
    //if user chooses a new file, 1) use that new file, 2) 
    //add new user input to req.body and 3) delete old image
    let newSauce;
    let oldFilename
    let fileUpload = false

    if (req.file) {
        fileUpload = true

        //find old file to delete
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {oldFilename = sauce.imageUrl.split('/images/')[1];})

        const url = req.protocol + '://' + req.get('host');

        newSauce = {
            ...JSON.parse(req.body.sauce),
            imageUrl: url + '/images/' + req.file.filename
        }
    }
    // else, just update req.body
    else {
        newSauce = {...req.body}
    }
        Sauce.findByIdAndUpdate({_id: req.params.id}, { $set: newSauce}, {new: true}, () => {
            if (fileUpload == true) {
                fs.unlink('images/' + oldFilename, (err) => {
                    if (err) throw err;
                });
                res.status(201).json({ message: 'Sauce info and image updated successfully!'})
            } else {
                res.status(201).json({ message: 'Sauce info updated successfully!'})
            }
        })
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            //success
            //1- Remove image 
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {

                 //1- Remove data from the model. 
                Sauce.deleteOne({_id: req.params.id})
                    .then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted!'
                        });
                    }
                )
                .then(console.log('id:' + req.params.id + ' deleted'))
                .catch(
                (error) => {
                    res.status(400).json({
                        error: error
                        });
                    }
                );
            });
        }
    );
};

exports.getAllSauce = (req, res, next) => {

    // my model is souce . find () is a function to get all items from database.
    // Then // that means is successful .. 
    //res ( result.status 200) & send all souces.in json
    //catch if ( error) .. send 400 status in result.
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeSauce = async (req, res, next) => {
    try {

        //1- findOne Souces
        const foundSauce = await Sauce.findOne({
            _id: req.params.id
        });

        // who user
        const userId = req.body.userId;

        // like : 1 & Dislike : -1
        const like = req.body.like;



        // make sure usersLiked Array only contains one copy of userId 
        //or else not at all
        if (like === 1) {
            if (!foundSauce.usersLiked.includes(userId)) {
                foundSauce.usersLiked.push(userId);
            }
        } else {
            if (foundSauce.usersLiked.includes(userId)) {
                //remove user from the array
                const userIdIndex = foundSauce.usersLiked.indexOf(userId);
                foundSauce.usersLiked.splice(userIdIndex);
            }
        }
        // set likes to the number of usersLiked
        foundSauce.likes = foundSauce.usersLiked.length;

        // make sure usersDisliked Array only contains one copy of
        // userId or else not at all
        if (like === -1) {
            if (!foundSauce.usersDisliked.includes(userId)) {
                foundSauce.usersDisliked.push(userId);
            }
        } else {
            if (foundSauce.usersDisliked.includes(userId)) {
                const userIdIndex = foundSauce.usersDisliked.indexOf(userId);
                foundSauce.usersDisliked.splice(userIdIndex);
            }
        }
        // set dislikes to the number of usersDisliked
        foundSauce.dislikes = foundSauce.usersDisliked.length;

        foundSauce.save();
        res.status(200).json({
            message: 'Form updated for likes/dislikes'
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error
        });
    }
};