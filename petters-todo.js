// simple-todos.js

Tasks = new Mongo.Collection("tasks");
Authors = new Mongo.Collection("author");

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        tasks: function() {
            if (Session.get("hideCompleted")) {
                // If hide completed is checked, filter tasks
                return Tasks.find({
                    checked: {
                        $ne: true
                    }
                }, {
                    sort: {
                        createdAt: -1
                    }
                });
            } else {
                // Otherwise, return all of the tasks
                return Tasks.find({}, {
                    sort: {
                        createdAt: -1
                    }
                });
            }
        },
        hideCompleted: function() {
            return Session.get("hideCompleted");
        },
        authors: function() {
            return Authors.find({});
        },
        incompleteCount: function() {
            return Tasks.find({
                checked: {
                    $ne: true
                }
            }).count();
        }
    });

    Template.body.events({
        "change .hide-completed input": function(event) {
            Session.set("hideCompleted", event.target.checked);
        },
        "submit .new-task": function(event) {
            // This function is called when the new task form is submitted

            var text = event.target.text.value;

            Tasks.insert({
                text: text,
                createdAt: new Date(), // current time
                owner: Meteor.userId(), // _id of logged in user
                username: Meteor.user().username // username of logged in user
            });

            // Clear form
            event.target.text.value = "";

            // Prevent default form submit
            return false;
        }
    });
    Template.task.events({
        "click .toggle-checked": function() {
            // Set the checked property to the opposite of its current value
            Tasks.update(this._id, {
                $set: {
                    checked: !this.checked
                }
            });
        },
        "click .delete": function() {
            Tasks.remove(this._id);
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
};

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
};