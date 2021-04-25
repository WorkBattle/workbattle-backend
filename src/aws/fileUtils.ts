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

export const checkIfExists = (pathToFile: string) => {
  const params = {
    Bucket: 'file-storage-workbattle',
    Key: pathToFile,
  };
  try {
    s3.headObject(params);
  } catch (err) {
    if (err && err.code === 'NotFound') {
      return { error: err };
    }
  }
  return {};
};

export const deleteFile = async (pathToFile: string) => {
  const params = {
    Bucket: 'file-storage-workbattle',
    Key: pathToFile,
  };
  return s3.deleteObject(params).promise();
};

(async () => {
  // await deleteFile('b55ddbe4-a692-4865-8076-8abe74ebc06f/sticker.jpg')
  // console.log(await s3.listObjects({Bucket: "file-storage-workbattle"}).promise());
})();
