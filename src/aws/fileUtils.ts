import { s3 } from './awsConnector';

export const uploadFile = (base64FileContent: Buffer, fileName: string) => {
  // Setting up S3 upload parameters
  const params = {
    Bucket: 'file-storage-workbattle',
    Key: fileName,
    Body: base64FileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, (err: any, data: any) => {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

export const getFileFromS3 = (pathTofile: string) => {
  const params = {
    Bucket: 'file-storage-workbattle',
    // Key: pathTofile,
  };
  s3.listObjects(params, (err, data) => {
    if (err) {
      console.log(err);
      return { error: err };
    } else {
      return data;
    }
  });
};

// const fs = require('fs');
// const util = require('util');

// const readFile = util.promisify(fs.readFile);

// async function getStuff(filePath: string) {
//   return readFile(filePath);
// }

// (async () => {
//   uploadFile(await getStuff('/Users/kostiantynmatvieienkov/Desktop/sticker.jpg'), 'useruuid/sticker.jpg');
//   // console.log(getFileFromS3('sticker.jpg'))
// })();
