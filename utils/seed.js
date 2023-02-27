const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);


connection.once('open', async () => {
    console.log('connected');
    await Thought.deleteMany({});
    await User.deleteMany({});
    
    const users = [];
    const reaction = [{"reactionBody": "Wow so cool!", "username":"tommythunda"}, 
    {"reactionBody":"Wow so cool broo!", "username":"vincentyo"}];
    const thoughts = [{"thoughtText":"tommys thought",  "username": "tommythunda", "reactions": reaction[0]}, {"thoughtText":"vincent thought", "username":"vincentyo","reactions": reaction[1]}];

    users.push({"username":"tommythunda", "email":"tommythunda121@gmail.com", "thoughts": thoughts[0]});
    users.push({"username":"vincentyo", "email":"vincentyo@gmail.com", "thoughts": thoughts[1]});

    await User.collection.insertOne(users[0]);
    await User.collection.insertOne(users[1]);
    await Thought.collection.insertOne(thoughts[0]);
    await Thought.collection.insertOne(thoughts[1]);

    console.table(users);
    console.table(thoughts);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});