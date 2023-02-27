const { Schema, model } = require('mongoose');

//The reaction sub-document is stored as an array in the thought schema.
const reactionSchema = new Schema(
    {
        reactionId: {type: Schema.Types.ObjectId, auto: true},
        reactionBody: {type: String, required: true, maxlength: 280},
        username: {type: String, required: true},
        createdAt: {type: Date, default: Date.now, get: (date) => moment(date).format("MMM DD, YYYY [at] hh:mm a")}
    }
);

const thoughtSchema = new Schema(
    {
        thoughtText: {type: String, required: true, minlength: 1, maxlength: 128 },
        createdAt: {type: Date, default: Date.now, get: (date) => moment(date).format("MMM DD, YYYY [at] hh:mm a")},
        username: {type:String, required: true},
        reactions: [reactionSchema]
    },
    {
        // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
        // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
        toJSON: {
            virtuals: true,
          },
          id: false,
    }
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;