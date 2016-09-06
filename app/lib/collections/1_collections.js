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
      toastr.error(message);
    }
  }
});

Sounds = new FS.Collection("sounds", {
  stores: [
    Stores.sounds
  ]
});

Documents = new FS.Collection("documents", {
  stores: [
    Stores.documents
  ],
  filter: {
    maxSize: 20 * 1024 * 1024, //in bytes
    allow: {
      contentTypes: [
                        "application/msword",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
                        "application/vnd.ms-word.document.macroEnabled.12",
                        "application/vnd.ms-word.template.macroEnabled.12",
                        "application/vnd.ms-excel",
                        "application/vnd.ms-excel",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
                        "application/vnd.ms-excel.sheet.macroEnabled.12",
                        "application/vnd.ms-excel.template.macroEnabled.12",
                        "application/vnd.ms-excel.addin.macroEnabled.12",
                        "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
                        "application/vnd.ms-powerpoint",
                        "application/vnd.ms-powerpoint",
                        "application/vnd.ms-powerpoint",
                        "application/vnd.ms-powerpoint",
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        "application/vnd.openxmlformats-officedocument.presentationml.template",
                        "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
                        "application/vnd.ms-powerpoint.addin.macroEnabled.12",
                        "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
                        "application/vnd.ms-powerpoint.template.macroEnabled.12",
                        "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
                        "application/pdf"
                        //, "image/jpeg" // no good rendering, image are just displayed with their name as attachment
                        //plus mix doc and image 
                    ]
    },
    onInvalid: function (message) {
      toastr.error(message);
    }
  }
  
  
});

function trueFunc(userId) {
  if (!userId) {
    // must be logged in
    return false;
  }
  return true;
}
function falseFunc() {
  return false;
}

// Files.allow({
//   insert: trueFunc,
//   update: trueFunc,
//   remove: trueFunc,
//   download: trueFunc
// });

Images.allow({
//for school signup, the user  is not logged in so we need to authorize to upload image
  insert: function()  { return true; } ,
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
Documents.allow({
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
