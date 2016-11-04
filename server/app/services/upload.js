function mediaUpload(fileName) {
  //.then((post) => {
  //  // Note(tony): Construct a media file key with the following syntax:
  //  //
  //  //   profile_id-post_id-hash-file_name.file_extension
  //  //
  //  // This convention will make sure we parse the file names correctly and without collision.
  //  for (let i = 0; i < media.length; ++i) {
  //    const fileParts = [
  //      post.profile_id,
  //      post.id,
  //      utils.generateHashWithDate(),
  //      media[i].name,
  //    ];
  //    const fileName = fileParts.join('-');
  //    uploader.uploadMedia(fileName);
  //  }
  //})
}

module.exports = {
  mediaUpload,
};
