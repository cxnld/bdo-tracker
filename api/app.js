const express = require('express');
const app = express();



//const mongoose = require('./db/mongoose');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/GatheringTracker', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to MongoDB successfully :)");
}).catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
});

// To prevent deprectation warnings (from MongoDB native driver)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const ObjectId = mongoose.Types.ObjectId;



const bodyParser = require('body-parser');

// Load in the Mongoose models
const { Activity, Session } = require('./db/models');
const { Router } = require('express');
const { reduce } = require('lodash');


/*******************************************************************************************************************/

/* MIDDLEWARE */

app.use(bodyParser.json());

// CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

/*******************************************************************************************************************/

// GET /activities
// Purpose: Get all activities
app.get('/activities', (req, res) => {
    Activity.find().then((activities) => {
        res.send(activities);
    }).catch((e) => {
        res.send(e);
    });
});

// GET /activities/:activityID
// Purpose: Get ONE activity
app.get('/activities/:activityID', (req, res) => {
    Activity.findOne({
        _id: req.params.activityID
    }).then((activity) => {
        res.send(activity);
    }).catch((e) => {
        res.send(e);
    });
});

// POST /activities
// Purpose: Create a new activity
app.post('/activities', (req, res) => {

    let newActivity = new Activity();
    
    newActivity.title = req.body.title;

    for (var i = 0; i < req.body.items.length; i++) {
        let x = req.body.items[i];
        newActivity.items.push(x);
    }

    newActivity.save().then((document) => {
        res.send(document);
    })
});

/*******************************************************************************************************************/
/* FUNCTIONS TO UPDATE AN ACTIVITY */

// PATCH /activities/:activityID/edit-activity/update-activity-name
// Purpose: Update the activity name
app.patch('/activities/:activityID/edit-activity/update-activity-name', (req, res) => {
    Activity.findOneAndUpdate(
        { "_id": req.params.activityID }, 
        { "$set": { "title": req.body.title } }
    ).then(() => {
        res.send({ 'message': 'updated title successfully'});
    });
});


// POST /activities/:activityID/edit-activity/add-activity-item
// Purpose: Add a new item to the activity
app.post('/activities/:activityID/edit-activity/add-activity-item', (req, res) => {
    let itemID = new ObjectId();
    Activity.findOneAndUpdate(
        { "_id": req.params.activityID },
        //{ "$push": { "items": req.body } },  // we created a new object under items with id name and price
        { "$push": { "items": { "_id": itemID, "name": req.body.name, "price": req.body.price } } },
        { new: true }
    ).then((doc) => { // updated activity is returned, use it to update all the sessions
        updateSessionsWithNewItem(req.params.activityID, itemID, req.body.name);
        res.send({ 'message': 'a new item has been added successfully'});
    })
});

// After adding a new item field from an activity, we must udpate the respective sessions with quantity 0
let updateSessionsWithNewItem = (_activityID, _itemID, itemName) => {
    // go thru all sessions, find sessions wiht right activityid then add a new item
    Session.updateMany(
        { _activityID },
        { "$push": { "items": { "name": itemName, "quantity": 0, "_itemID": _itemID } } }
    ).then(() => {
        console.log("Sessions from " + _activityID + " were updated with a new item");
    })
}

// PATCH /activities/:activityID/edit-activity/:itemID/update-activity-item
// Purpose: Update an activity item field
app.patch('/activities/:activityID/edit-activity/:itemID/update-activity-item', (req, res) => {
    Activity.findOneAndUpdate(
        { "_id": req.params.activityID, "items._id": req.params.itemID },
        // *read notes* for why condition is like this
        { "$set": { "items.$.name": req.body.name, "items.$.price": req.body.price } },
        { new: true }
    ).then((doc) => {
        updateSessionsWithUpdatedItem(req.params.activityID, req.params.itemID, req.body.name);
        //res.send({ 'message': 'updated successfully'});
        res.send(doc);
    });
});

// After udpating an item field from an activity, we must udpate the respective sessions
let updateSessionsWithUpdatedItem = (_activityID, _itemID, updatedItemName) => {
    Session.updateMany(
        { "_activityID": _activityID, "items._itemID": _itemID },
        { "$set": { "items.$.name": updatedItemName } }
    ).then(() => {
        console.log("Sessions from " + _activityID + " have an item name updated");
    })
}


/*
Notes for condition: { "$set": { "items.$": req.body } }
When you set the values like this, it will completely wipe the old record and replace it with req.body
The problem with is that the _id will change because it is totally new.
By setting the individual entries "name" and "price", we update the original record, not make a new one.
*/

// DELETE /activities/:activityID/edit-activity/:itemID
// Purpose: Delete an activity item field
app.delete('/activities/:activityID/edit-activity/:itemID', (req, res) => {
    Activity.findOneAndUpdate(
        { "_id": req.params.activityID }, 
        { "$pull": { "items": { _id: req.params.itemID } } }
    ).then(() => {
        deleteItemFromSessions(req.params.activityID, req.params.itemID);
        res.send({ 'message': 'item removed successfully'});
    });
});

// After deleting an item from an activity, we must delete it from its respective sessions
let deleteItemFromSessions = (_activityID, _itemID) => {
    Session.updateMany(
        { "_activityID": _activityID, "items._itemID": _itemID },
        { "$pull": { "items": { "_itemID": _itemID } } }
    ).then(() => {
        console.log("An item from sessions of " + _activityID + " has been removed");
    })
}

/*******************************************************************************************************************/


// DELETE /activities/:id
// Purpose: Delete an activity
app.delete('/activities/:id', (req, res) => {
    Activity.findOneAndRemove({ 
        _id: req.params.id
    }).then((removedActivityDoc) => {
        res.send(removedActivityDoc);
        deleteSessionsFromActivity(removedActivityDoc._id);
    });
});

let deleteSessionsFromActivity = (_activityID) => {
    Session.deleteMany({
        _activityID
    }).then(() => {
        console.log("Sessions from " + _activityID + " were deleted!");
    })
}

/*******************************************************************************************************************/

// GET /activities/:activityID/sessions
// Purpose: Get all sessions under the specified activityID
app.get('/activities/:activityID/sessions', (req, res) => {
    Session.find({
        _activityID: req.params.activityID
    }).then((sessions) => {
        res.send(sessions);
    })
});

// GET /activities/:activityID/sessions/:sessionID
// Purpose: Get a specific session
app.get('/activities/:activityID/sessions/:sessionID', (req, res) => {
    Session.findOne({
        _id: req.params.sessionID,
        _activityID: req.params.activityID
    }).then((session) => {
        res.send(session);
    })
});

// POST /activities/:activityID/sessions
// Purpose: Create a new session under the specified activityID
app.post('/activities/:activityID/sessions', (req, res) => {

    let newSession = new Session();
    newSession.title = req.body.title;
    newSession._activityID = req.params.activityID;
    newSession.time = req.body.time;

    for (var i = 0; i < req.body.items.length; i++) {
        let x = req.body.items[i];
        newSession.items.push(x);
    }

    newSession.save().then((document) => {
        res.send(document);
    });

});

/*******************************************************************************************************************/

// PATCH /activities/:activityID/sessions/:sessionID
// Purpose: Update an existing session under the specified activityID
app.patch('/activities/:activityID/sessions/:sessionID', (req, res) => {
    Session.findOneAndUpdate(
        { _id: req.params.sessionID, _activityID: req.params.activityID },
        { $set: req.body }
    ).then(() => {
        res.send({ message: 'Updated successfully.' })
    })
});

// DELETE /activities/:activityID/sessions/:sessionID
// Purpose: Delete a session
app.delete('/activities/:activityID/sessions/:sessionID', (req, res) => {
    Session.findOneAndRemove({
        _id: req.params.sessionID,
        _activityID: req.params.activityID
    }).then((document) => {
        res.send(document);
    });
});


app.listen(3000, () => {
    console.log("Server is listening on port 3000 xD");
})