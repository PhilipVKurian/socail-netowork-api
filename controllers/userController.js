const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
    getUsers(req, res) {
        User.find()
            .select('-__v')
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    getUserById(req,res){
        User.findOne({_id: req.params.userId})
            .select('-__v')
            .populate('thoughts')
            .populate('friends')
            .then((user) => {
                if(!user){
                    res.status(404).json({message: 'No user Found matching that ID'})
                }
                res.json(user)
            })
            .catch((err) => res.status(500).json(err));
    },
    createUser(req, res) {
        User.create(req.body)
          .then((dbUserData) => res.json(dbUserData))
          .catch((err) => res.status(500).json(err));
    },
    updateUser(req,res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body}
        ).then(((user) => {
            if(!user){
                res.status(404).json({message: 'No user Found matching that ID'})
            }
            res.json("User updated!")
        }))
        .catch((err) => res.status(404).json(err));
    },
    deleteUser(req, res){
        User.deleteOne(
            {_id: req.params.userId}
        )
        .then((user) => {
            if(!user){
                res.status(404).json({message: 'No User Found with that ID'})
            }
            Thought.deleteMany({_id: { $in: user.thoughts}})
            res.json("User deleted")
        })
        .catch((err) => res.status(500).json(err));
    },
    addFriend(req,res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$addToSet: {friends: req.params.fId}},
            { runValidators: true, new: true }
        )
        .then((user) => {
            if(!user){
                res.status(404).json({message: 'No User Found with that ID'})
            }
            res.json(user)
        })
        .catch((err) => res.status(500).json(err));
    },
    deleteFriend(req,res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.fId}}
        )
        .then((user) => {
            if(!user){
                res.status(404).json({message: 'No User Found with that ID'})
            }
            res.json({message: 'Friend was removed'})
        })
        .catch((err) => res.status(500).json(err));
    },
};