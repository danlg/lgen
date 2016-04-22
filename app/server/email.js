Meteor.startup(function () {
    process.env.MAIL_URL = 'smtp://'
    + Meteor.settings.SPARKPOST_USERNAME
    + ':'
    + Meteor.settings.SPARKPOST_PASSWORD
    + '@'
    + Meteor.settings.SPARKPOST_HOST
    + ':'
    + Meteor.settings.SPARKPOST_PORT;
});