/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
getUserLanguage = function () {
  // Put here the logic for determining the user language

  var pattern = /-.*/g;

  navigator.globalization.getPreferredLanguage(
    function (language) {
      // alert('language: ' + language.value + '\n');
      log.info(language);
      var lang = language.value.replace(pattern, "");
      return lang;
    },
    function () {
      log.error('Error getting language\n');
    }
  );


};

randomString = function (length, chars) {
  chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
};


lodash.mixin({
  'findByValues': function (collection, property, values) {
    return lodash.filter(collection, function (item) {
      return lodash.includes(item[property], values);
    });
  }
});

lodash.mixin({
  'findByValues2': function (collection, property, values) {
    return lodash.filter(collection, function (item) {
      return item[property] == values;
    });
  }
});

lodash.mixin({
  'findByValuesNested': function (collection, property, secproperty, values) {
    return lodash.filter(collection, function (item) {
      return lodash.includes(item[property][secproperty], values);
    });
  }
});


getClassCode = function (className) {
  var beforeHash = Meteor.user().email + className + new Date().getTime().toString();
  return CryptoJS.SHA1(randomString(10), beforeHash).toString().substring(0, 6);
};

getClassCodeNew = function (className) {
  var firstname = Meteor.user().profile.firstname;
  var lastname = Meteor.user().profile.lastname;
  var name = firstname.substring(0, 1) + lastname.substring(0, 4);
  var fullname = name + className;
  return fullname.toLowerCase();
};

getLastnameOfCurrentUser = function(requiredCharLength){
  
    var userProfile = Meteor.user().profile;
    var trimlastname;
    if (userProfile) {
      if (userProfile.lastname.length < requiredCharLength) {
        trimlastname = userProfile.lastname;
      } else {
        trimlastname = userProfile.lastname.substr(0, requiredCharLength);
      }
    } else {
      trimlastname = "";
    }

    return trimlastname.toLowerCase();  
};


getFullNameByProfileObj = function (profile) {
  return profile.firstname + " " + profile.lastname;
};
getFullNameOfCurrentUser = function () {
  var profile = Meteor.user().profile;
  return profile.firstname + " " + profile.lastname;
};

validateEmail = function (email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
};


getNewRecordFile = function () {

  var src = moment().format('x') + ".wav";
  mediaRec = new Media(src,
    // success callback
    function () {
      log.info("recordAudio():Audio Success");
    },

    // error callback
    function (err) {
      log.error("recordAudio():Audio Error: " + err.code);
    }
  );

  return mediaRec;

};


getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}