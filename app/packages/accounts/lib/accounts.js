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
    "profile.avatarType": {
        type: String,
        optional: true
    },
    "profile.avatarValue": {
        type: String,
        optional: true
    },
    "profile.avatarLarge": {
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
        type: String,
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
    },
    gender: {
        type: String,
        optional: true
    },
    // The following fields should be moved to
    // the `schools` array later, when more than one school is required
    studentId: {
        type: String,
        optional: true
    },

    grade: { type: String, optional: true },
    grade_shadow: { type: String, optional: true },
    classroom: { type: String,  optional: true },
    classroom_shadow: { type: String,  optional: true },

    country: {
        type: String,
        optional: true
    },
    organization: {
        type: String,
        optional: true
    }
});

//need to be shared between client(my_account page) and server
//only the below fields can be updated by the user her/himself
Smartix.Accounts.editUserSchema = Smartix.Accounts.Schema.pick([
    'username',
    'profile.firstName',
    'profile.lastName',
    'dob',
    'city',
    'lang',
    'tel',
    'profile.avatarValue',
    'profile.avatarType',
    'profile.avatarLarge',
    'country',
    'organization'
]);