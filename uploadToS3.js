const s3FolderUpload = require('s3-folder-upload');
const path = require('path');

const directoryName = process.argv[2]; // Pass the directory name as a command line argument
const bucketName = process.env.AWS_S3_BUCKET_NAME;

if (!directoryName) {
  console.error('Please provide a directory name to upload');
  process.exit(1);
}

const options = {
  useFoldersForFileTypes: false,
  useIAMRoleCredentials: false,
  uploadFolder: path.join(__dirname, directoryName),
  folderName: `totems/${directoryName.replace(/\s+/g, '_')}`,
  bucketName: bucketName,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

s3FolderUpload(options)
  .then(() => {
    console.log('Folder uploaded successfully');
  })
  .catch((err) => {
    console.error('Error uploading folder:', err);
  });
