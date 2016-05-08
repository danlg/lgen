/*! Copyright (c) 2015-2016 Little Genius Education Ltd.  All Rights Reserved. */

// See https://github.com/raix/push
// When a client calls send on Push, the Push's allow and deny callbacks are called on the server to determine if the
// send should be allowed. If at least one allow callback allows the send, and no deny callbacks deny the send,
// then the send is allowed to proceed.'

Push.allow({
  send: function (userId, notification) {
    return true; // Allow all users to send
  }
});
