createThumb = function(fileObj, readStream, writeStream) {
  // Transform the image into a 10x10px thumbnail
  gm(readStream, fileObj.name()).resize('100', '100').stream().pipe(writeStream);
};

imageStore = new FS.Store.GridFS("images");

soundStore = new FS.Store.GridFS("sounds");


Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("thumbs", { transformWrite: createThumb }),
    imageStore
  ]
});

Sounds = new FS.Collection("sounds", {
  stores: [soundStore]
});



// Images.deny({
//   insert: function() {
//     return false;
//   },
//   update: function() { 
//     return false;
//   },
//   remove: function() {
//     return false;
//   },
//   download: function() {
//     return false;
//   }
// });

Images.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  download: function() {
    return true;
  }
});

Sounds.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  download: function() {
    return true;
  }
});
