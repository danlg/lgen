Template.AppChangeVote.helpers({
 isSelectAction: function(action) {
        if (action)
            return lodash.includes(action, Meteor.userId()) ? "colored current-vote-option" : "other-vote-option";
    }
});