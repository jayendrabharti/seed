import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from './s3';

export async function getFileUrl({
  bucket,
  key,
  visibility,
}: S3File): Promise<string> {
  if (visibility === 'PUBLIC') {
    return `https://${process.env.AWS_S3_BUCKET_NAME!}.s3.${process.env.AWS_REGION!}.amazonaws.com/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 300, // 5 minutes
  });
}
