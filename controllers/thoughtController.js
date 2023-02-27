const Thought = require('../models/Thought');
const User = require('../models/User');
module.exports = {
    getThoughts(req,res){
        Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err)=> res.status(500).json(err));
    },
    getThoughtById(req,res){
        Thought.findOne({_id: req.params.thoughtId})
        .select('-__v')
        .populate('reactions')
        .then((thought) => {
            if(!thought){
                res.status(404).json({message: 'No thoughts Found matching that ID'})
            }
            res.json(thought)
        })
        .catch((err) => res.status(500).json(err));
    },
    createThought(req,res){
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                {_id: req.params.userId},
                {$push: {thoughts: thought._id}},
                { new: true}
            );
        })
        .then((thought) =>
            !thought
            ? res.status(404).json("User ID was not found")
            : res.json('Created the Thought! 🎉')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with this id!' })
              : res.json({ message: 'Thought Updated!' })
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
    },
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with this id!' })
                : User.findOneAndUpdate(
                    { thoughts:  req.params.thoughtId}, //req.params.thoughId
                    { $pull: { thoughts: req.params.thoughtId} },
                    { new: true }
                )
            )
            .then((thought) =>
            !thought
                ? res
                    .status(404)
                    .json({ message: 'thought deleted but no user with this id!' })
                : res.json({ message: 'thought successfully deleted!' })
            )
            .catch((err) => res.status(500).json(err));
    },
    createReaction(req,res){
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: 'No thought matching id!' })
            : res.json({ message: 'Reaction added!' })
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req,res){
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId:req.params.reactionId}}}
        )
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: 'No thought matching id!' })
            : res.json({ message: 'Reaction Deleted!' })
        )
        .catch((err) => res.status(500).json(err));
    },
};