import { S3 } from 'aws-sdk';

export const s3 = new S3({
  accessKeyId: process.env.AWSS3ID,
  secretAccessKey: process.env.AWSS3SECRET,
});

// eu-west-1
