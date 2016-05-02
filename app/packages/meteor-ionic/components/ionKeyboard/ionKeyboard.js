Meteor.startup(function () {
  if (Meteor.isCordova && Platform.isAndroid()) {
    IonKeyboard.disableScroll();
  }
});

IonKeyboard = {
  close: function () {
    if (Meteor.isCordova && Platform.isAndroid()) {
      cordova.plugins.Keyboard.close();
    }
  },

  show: function () {
    if (Meteor.isCordova && Platform.isAndroid()) {
      cordova.plugins.Keyboard.show();
    }
  },

  hideKeyboardAccessoryBar: function () {
    if (Meteor.isCordova && Platform.isAndroid()) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
  },

  showKeyboardAccessoryBar: function () {
    if (Meteor.isCordova && Platform.isAndroid()) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
  },

  disableScroll: function () {
    if (Meteor.isCordova && Platform.isAndroid()) {
      cordova.plugins.Keyboard.disableScroll(true);
    }
  },

  enableScroll: function () {
    if (Meteor.isCordova && Platform.isAndroid()) {
      cordova.plugins.Keyboard.disableScroll(false);
    }
  }
};

window.addEventListener('native.keyboardshow', function (event) {
  if ( Platform.isAndroid()) {

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
  }
});

window.addEventListener('native.keyboardhide', function (event) {
  if (Meteor.isCordova && Platform.isAndroid()) {

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
  }
});