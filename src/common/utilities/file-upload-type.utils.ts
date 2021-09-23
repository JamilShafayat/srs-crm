export const imageFileFilter = (file, callback) => {
  if (!file.originalName.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    return callback(new Error('Only image or PDF files are allowed!'), false);
  }
  callback(null, true);
};
