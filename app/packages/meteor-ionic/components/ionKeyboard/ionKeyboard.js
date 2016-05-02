/*
Meteor.startup(function () {
  if (Meteor.isCordova) {
    //IonKeyboard.disableScroll();
  }
});

IonKeyboard = {
  close: function () {
    console.log("IonKeyboard.close");
    if (Meteor.isCordova) {
      Keyboard.hide();
    }
  },

  show: function () {
    console.log("IonKeyboard.show");
    if (Meteor.isCordova) {
      Keyboard.show();
    }
  },

  hideKeyboardAccessoryBar: function () {
    console.log("IonKeyboard.hideKeyboardAccessoryBar");
    if (Meteor.isCordova) {
      Keyboard.hideFormAccessoryBar(true);
    }
  },

  showKeyboardAccessoryBar: function () {
    console.log("IonKeyboard.showKeyboardAccessoryBar");
    if (Meteor.isCordova) {
      Keyboard.hideFormAccessoryBar(false);
    }
  },

  disableScroll: function () {
    console.log("IonKeyboard.disableScroll");
    if (Meteor.isCordova) {
      Keyboard.disableScrollingInShrinkView(true);
    }
  },

  enableScroll: function () {
    console.log("IonKeyboard.enableScroll");
    if (Meteor.isCordova) {
      Keyboard.disableScrollingInShrinkView(false);
    }
  }
};

window.addEventListener('native.keyboardshow', function (event) {
  console.log("IonKeyboard.native.keyboardshow");




/*
  $('body').addClass('keyboard-open');
  var keyboardHeight = event.keyboardHeight;

  // Attach any elements that want to be attached
  $('[data-keyboard-attach]').each(function (index, el) {
    $(el).data('ionkeyboard.bottom', $(el).css('bottom'));
    $(el).css({bottom: keyboardHeight});
  });

  // Move the bottom of the content area(s) above the top of the keyboard
  $('.content.overflow-scroll').each(function (index, el) {
    $(el).data('ionkeyboard.bottom', $(el).css('bottom'));
    $(el).css({bottom: keyboardHeight});
  });

  // Scroll to the focused element
  scrollToFocusedElement(null, keyboardHeight);
/
});

window.addEventListener('native.keyboardhide', function (event) {
  console.log("IonKeyboard.native.keyboardhide");
/*
  // $('input, textarea').blur();
  $('body').removeClass('keyboard-open');

  // Detach any elements that were attached
  $('[data-keyboard-attach]').each(function (index, el) {
    $(el).css({bottom: $(el).data('ionkeyboard.bottom')});
  });

  // Reset the content area(s)
  $('.content.overflow-scroll').each(function (index, el) {
    $(el).css({bottom: $(el).data('ionkeyboard.bottom')});
  });
/
});

*/

/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
/*
var argscheck = require('cordova/argscheck'),
  utils = require('cordova/utils'),
  exec = require('cordova/exec');

var Keyboard = function() {
};

Keyboard.shrinkView = function(shrink) {
  exec(null, null, "Keyboard", "shrinkView", [shrink]);
};

Keyboard.hideFormAccessoryBar = function(hide) {
  exec(null, null, "Keyboard", "hideFormAccessoryBar", [hide]);
};

Keyboard.disableScrollingInShrinkView = function(disable) {
  exec(null, null, "Keyboard", "disableScrollingInShrinkView", [disable]);
};

Keyboard.fireOnShow = function() {
  Keyboard.isVisible = true;
  cordova.fireWindowEvent('keyboardDidShow');

  if(Keyboard.onshow) {
    Keyboard.onshow();
  }
};

Keyboard.fireOnHide = function() {
  Keyboard.isVisible = false;
  cordova.fireWindowEvent('keyboardDidHide');

  if(Keyboard.onhide) {
    Keyboard.onhide();
  }
};

Keyboard.fireOnHiding = function() {
  // Automatic scroll to the top of the page
  // to prevent quirks when using position:fixed elements
  // inside WebKit browsers (iOS specifically).
  // See CB-6444 for context.
  if (Keyboard.automaticScrollToTopOnHiding) {
    document.body.scrollLeft = 0;
  }

  cordova.fireWindowEvent('keyboardWillHide');

  if(Keyboard.onhiding) {
    Keyboard.onhiding();
  }
};

Keyboard.fireOnShowing = function() {
  cordova.fireWindowEvent('keyboardWillShow');

  if(Keyboard.onshowing) {
    Keyboard.onshowing();
  }
};

Keyboard.show = function() {
  exec(null, null, "Keyboard", "show", []);
};

Keyboard.hide = function() {
  exec(null, null, "Keyboard", "hide", []);
};

Keyboard.isVisible = false;
Keyboard.automaticScrollToTopOnHiding = false;

module.exports = Keyboard;
*/