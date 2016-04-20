Smartix = Smartix || {};

Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.Schema = new SimpleSchema({
    username: {
        type: String,
        optional: true
    },
    emails: {
        type: Array,
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Object,
        blackbox: true,
        optional: true
    },
    "profile.firstName": {
        type: String,
        optional: true
    },
    "profile.lastName": {
        type: String,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    dob: {
        type: Date,
        optional: true
    },
    city: {
        type: String,
        optional: true,
        defaultValue: "Hong Kong"
    },
    lang: {
        type: String,
        optional: true,
        defaultValue: "en"
    },
    tel: {
        type: String,
        optional: true
    },
    emailNotifications: {
        type: Boolean,
        defaultValue: false
    },
    pushNotifications: {
        type: Boolean,
        defaultValue: true
    },
    firstChat: {
        type: Boolean,
        defaultValue: true
    },
    firstInvitation: {
        type: Boolean,
        defaultValue: true
    },
    firstPicture: {
        type: Boolean,
        defaultValue: true
    },
    firstClassJoined: {
        type: Boolean,
        defaultValue: true
    },
    hybridAppPromote: {
        type: Boolean,
        defaultValue: false
    },
    hasUserSeenTour: {
        type: Boolean,
        defaultValue: false
    },
    referral: {
        type: Number,
        decimal: false,
        defaultValue: 0
    },
    heartbeat: {
        type: Date,
        optional: true
    }
});