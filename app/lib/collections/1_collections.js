Images = new FS.Collection("images", {
  stores: [
    Stores.images,
    Stores.thumbs
  ],
  filter: {
    maxSize: 20 * 1024 * 1024, //in bytes
    allow: {
      contentTypes: ['image/*']
    },
    onInvalid: function (message) {
      alert(message);
    }
  }
});

Sounds = new FS.Collection("sounds", {
  stores: [
    Stores.sounds
  ]
});

function trueFunc(userId) {
  //must be logged in => userId defined
  return userId ? true : false;
  //return doc.userId === userId;;
}

function isOwner (userId, doc) {
  //TODO see issue #105
  //should be at the very least isOwner
  //see http://joshowens.me/meteor-security-101/
  var isOwner = doc && (doc.userId === userId);
  return isOwner;
}

function falseFunc() {
  return false;
}

Images.allow({
  insert: isOwner,
  update: isOwner,
  remove: isOwner,
  download: isOwner
});
Sounds.allow({
  insert: isOwner,
  update: isOwner,
  remove: isOwner,
  download: isOwner
});


// Files.allow({
//   insert: isOwner,
//   update: isOwner,
//   remove: isOwner,
//   download: isOwner
// });

// Docs.allow({
//   insert: isOwner,
//   update: isOwner,
//   remove: isOwner
// });
//
// Docs2.allow({
//   insert: isOwner,
//   update: isOwner,
//   remove: isOwner
// });

// Files = new FS.Collection("files", {
//   stores: [Stores.any],
//   chunkSize: 4 * 1024 * 1024
// });
//
// Docs = new Mongo.Collection("docs");
// Docs.attachSchema(new SimpleSchema({
//   name: {
//     type: String
//   },
//   fileId: {
//     type: String,
//     autoform: {
//       type: "cfs-file",
//       collection: "files"
//     }
//   }
// }));
//
// Docs2 = new Mongo.Collection("docs2");
// Docs2.attachSchema(new SimpleSchema({
//   name: {
//     type: String
//   },
//   fileId: {
//     type: [String],
//     autoform: {
//       type: "cfs-files",
//       collection: "files"
//     }
//   }
// }));
