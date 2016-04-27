_ = lodash;

Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.Addons = Smartix.Messages.Addons || {};

Smartix.Messages.Addons.ValidTypes = Smartix.Messages.Addons.ValidTypes || [];

Smartix.Messages.Addons.Poll = Smartix.Messages.Addons.Poll || {};

Smartix.Messages.Addons.Poll.canChangeVotes = function (messageId) {
    // Retrieve information about the message
    // including the group that it belongs to
    var message = Smartix.Messages.Collection.findOne({
        _id: messageId
    });
    
    if(!message) {
        return false;
        // OPTIONAL: Throw error indicating message does not exist
    }
    
    // Checks the user is a member of said group
    // using `isUserInGroup()` from the `smartix:groups` package
    if(!Smartix.Groups.isUserInGroup(Meteor.userId(), message.group)) {
        return false;
        // OPTIONAL: Throw error indicating the user is not part of the group
    }
    
    // Retrieves the addon object of type `poll`
    pollObj = _.find(message.addons, function (addon) {
        return addon.type === Smartix.Messages.Addons.Poll.Type;
    });
    
    // Checks that the current time is not after `expires`
    if(pollObj.expires
        && Date.now() > pollObj.expires) {
        return false;
        // OPTIONAL: Throw error indicating the poll has finished
        // and does not accept new votes
    }
  
    return pollObj;
}

Smartix.Messages.Addons.Poll.updateNewPoll = function (messageId, pollObj) {
    // Update the message
    console.log(Smartix.Messages.Addons.Poll.Type);
    Smartix.Messages.Collection.update({
        _id: messageId
    },
    { $pull: { addons: {type: Smartix.Messages.Addons.Poll.Type }  } },
    function (error, n) {
        if(!error) {
            
            console.log(pollObj)
            console.log(pollObj.votes);
            
            Smartix.Messages.Collection.update({
                _id: messageId
            }, {
                $push: { addons: pollObj}
            });
        }
    });
}

// Change the name of an option in the poll
Smartix.Messages.Addons.Poll.changeOptionName = function (messageId, oldName, newName) {
    
    check(messageId, String);
    check(oldName, String);
    check(newName, String);
    
    // Makes sure the user have the correct permissions
    if(!Smartix.Messages.Addons.canUserAttachAddon(messageId, ['poll'])) {
        return false;
        // OPTIONAL: Throw error indicating
        // the user does not have permission
        // to change the option names in the poll
    }
    
    var message = Smartix.Messages.Collection.findOne({
        _id: messageId
    });
    
    if(!message) {
        return false;
        // OPTIONAL: Throw error indicating message does not exist
    }
    
    // Retrieves the addon object of type `poll`
    pollObj = _.find(message.addons, function (addon) {
        return addon.type = Smartix.Messages.Addons.Poll.Type;
    });
    
    // Checks that an option with `oldName` exists in the `options` array
    // (It SHOULD exist already)
    if(pollObj.options.indexOf(oldName) < 0) {
        return false;
        // OPTIONAL: Throw an error indicating the option does not exists
    }
    
    // Checks that an option with `oldName` exists in the `options` array
    // It should NOT exist, otherwise there'll be a clash
    if(pollObj.options.indexOf(newName) > -1) {
        return false;
        // OPTIONAL: Throw an error indicating the option already exists
    }
    
    // Pull the element matching `oldName` from the `options` array
    pollObj.options = _.pull(pollObj.options, oldName);
    
    // Add `newName` to the `options` array
    pollObj.options.push(newName);
    
    // Change the name in the `votes` object array
    pollObj.votes = _.map(pollObj.votes, function (vote) {
        if(vote.option === oldName) {
            vote.option = newName;
        }
        return vote;
    });
    
    // Update the message
    Smartix.Messages.Collection.update({
        _id: messageId
    }, {
        $pull: {
            addons: {
                type: Smartix.Messages.Addons.Poll.Type
            }
        }
    }, function (error, n) {
        if(!error) {
            Smartix.Messages.Collection.update({
                _id: messageId
            }, {
                $push: pollObj
            });
        }
    });
}



// Merge multiple polling options into one
Smartix.Messages.Addons.Poll.mergeOptions = function (options, name) {
    check(options, [String]);
    check(name, String);
    
    
    // Makes sure the user have the correct permissions
    if(!Smartix.Messages.Addons.canUserAttachAddon(messageId, ['poll'])) {
        return false;
        // OPTIONAL: Throw error indicating
        // the user does not have permission
        // to change the option names in the poll
    }
    
    var message = Smartix.Messages.Collection.findOne({
        _id: messageId
    });
    
    if(!message) {
        return false;
        // OPTIONAL: Throw error indicating message does not exist
    }
    
    // Retrieves the addon object of type `poll`
    pollObj = _.find(message.addons, function (addon) {
        return addon.type = Smartix.Messages.Addons.Poll.Type;
    });
    
    // Checks that all the options specified in the `options` argument exists in the document's `options` array
    // (they SHOULD exist already)
    _.each(options, function(option, i, options) {
        if(pollObj.options.indexOf(option) < 0) {
            return false;
            // OPTIONAL: Throw an error indicating the option does not exists
        }
    });
    
    // Checks that an option with `oldName` exists in the `options` array
    // It should NOT exist, otherwise there'll be a clash
    if(pollObj.options.indexOf(name) > -1) {
        return false;
        // OPTIONAL: Throw an error indicating the option already exists
    }
    
    // Pull the elements matching `options` from the `pollObj.options` array
    pollObj.options = _.pullAll(pollObj.options, options);
    
    // Add `name` to the `options` array
    pollObj.options.push(name);
    
    // Change the name in the `votes` object array
    
    // Collect all the votes from the options to be merged
    var newCollectiveVotes = [];
    
    for(var i = 0; i < pollObj.votes.length; i++) {
        if(options.indexOf(pollObj.votes[i].option) > -1) {
            newCollectiveVotes.push(users);
            
        }
    }
    
    // Remove the `options` from the votes object array
    pollObj.votes = _.filter(pollObj.votes, function (vote, i, votes) {
        // If it is not in the ones specified to be removed, keep the element
        if(options.indexOf(vote.option) < 0) {
            return true;
        }
        return false;
    });
    
    pollObj.votes.push({
        option: name,
        // Weed out any duplicates
        users: _.uniq(newCollectiveVotes)
    });
    
    // Update the message
    Smartix.Messages.Addons.Poll.updateNewPoll(messageId, pollObj);
}

// Remove polling option
Smartix.Messages.Addons.Poll.removeOptions = function(messageId, options) {
    check(messageId, String);
    check(options, [String]);
    
    // Makes sure the user have the correct permissions
    if(!Smartix.Messages.Addons.canUserAttachAddon(messageId, ['poll'])) {
        return false;
        // OPTIONAL: Throw error indicating
        // the user does not have permission
        // to change the option names in the poll
    }
    
    var message = Smartix.Messages.Collection.findOne({
        _id: messageId
    });
    
    if(!message) {
        return false;
        // OPTIONAL: Throw error indicating message does not exist
    }
    
    // Retrieves the addon object of type `poll`
    pollObj = _.find(message.addons, function (addon) {
        return addon.type = Smartix.Messages.Addons.Poll.Type;
    });
    
    // Pull the elements matching `options` from the `pollObj.options` array
    pollObj.options = _.pullAll(pollObj.options, options);
    
    // Remove the `options` from the votes object array
    pollObj.votes = _.filter(pollObj.votes, function (vote, i, votes) {
        // If it is not in the ones specified to be removed, keep the element
        if(options.indexOf(vote.option) < 0) {
            return true;
        }
        return false;
    });
    
    // Update the message
    Smartix.Messages.Addons.Poll.updateNewPoll(messageId, pollObj);
}

// Cast a vote for an option
Smartix.Messages.Addons.Poll.castVote = function (messageId, option) {
    check(messageId, String);
    check(option, String);
    
    pollObj = Smartix.Messages.Addons.Poll.canChangeVotes(messageId);
    
    if(!pollObj) {
        return false;
        // OPTIONAL: Throw error indicating you can no longer change your vote
    }
    
    // Checks if the user has voted for another option already
    // If `multiple` is set to `false`
    // Remove the vote from the other options
    if(pollObj.multiple === false) {
        pollObj.votes = _.map(pollObj.votes, function (voteOption) {
            _.pull(voteOption.users, Meteor.userId());
            return voteOption;
        });
    }
    
    _.map(pollObj.votes, function (voteOption) {
        if(voteOption.option === option) {
            voteOption.users.push(Meteor.userId());
        }
        return voteOption;
    });
    
    Smartix.Messages.Addons.Poll.updateNewPoll(messageId, pollObj);
    
}

// Remove vote for an option
Smartix.Messages.Addons.Poll.uncastVote = function (messageId, option) {
    check(messageId, String);
    check(option, String);
    
    pollObj = Smartix.Messages.Addons.Poll.canChangeVotes(messageId);
    
    if(!pollObj) {
        return false;
        // OPTIONAL: Throw error indicating you can no longer change your vote
    }
    
    _.map(pollObj.votes, function (voteOption) {
        pollObj.votes = _.pull(voteOption.users, Meteor.userId());
        return voteOption;
    });
    
    // Update the message
    Smartix.Messages.Addons.Poll.updateNewPoll(messageId, pollObj);
}