/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Schema = Schema || {};

Schema.profile = {
    firstName: "",
    lastName: "",
    role: "",
    dob: "",
    organization: "",
    city: "",
    lang: "",
    emailNotifications: false, //default as false so user needs to opt it to receive email message notificaiton
    pushNotifications: true,
    firstChat: true,
    firstInvitation: true,
    firstPicture: true,
    firstClassJoined: true,
    hybridAppPromote: false,
    hasUserSeenTour: false
};
