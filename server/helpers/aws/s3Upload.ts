import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from './s3';
import { S3CreateUploadUrlArgs, S3UploadUrlResponse } from '../../types/s3';

export async function createUploadUrl({
  key,
  contentType,
  isPublic,
}: S3CreateUploadUrlArgs): Promise<S3UploadUrlResponse> {
  if (isPublic) {
    key = `public/${key}`;
  }

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60, // 1 minute
  });

  const publicUrl = isPublic
    ? `https://${process.env.AWS_S3_BUCKET_NAME!}.s3.${process.env.AWS_REGION!}.amazonaws.com/${key}`
    : null;

  return {
    uploadUrl,
    key,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    visibility: isPublic ? 'PUBLIC' : 'PRIVATE',
    publicUrl,
  };
}
