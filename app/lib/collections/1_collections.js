


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
    onInvalid: function(message) {
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
  if (!userId) {
    // must be logged in
    return false;
  }

  return true;
}
function falseFunc() {return false;}

// Files.allow({
//   insert: trueFunc,
//   update: trueFunc,
//   remove: trueFunc,
//   download: trueFunc
// });

Images.allow({
  insert: trueFunc,
  update: trueFunc,
  remove: trueFunc,
  download: trueFunc
});
Sounds.allow({
  insert: trueFunc,
  update: trueFunc,
  remove: trueFunc,
  download: trueFunc
});


// Docs.allow({
//   insert: trueFunc,
//   update: trueFunc,
//   remove: trueFunc
// });
//
// Docs2.allow({
//   insert: trueFunc,
//   update: trueFunc,
//   remove: trueFunc
// });


//
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
