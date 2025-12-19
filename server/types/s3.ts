interface S3CreateUploadUrlArgs {
  contentType: string;
  key: string;
  isPublic: boolean;
}

interface S3File {
  bucket: string;
  key: string;
  visibility: 'PUBLIC' | 'PRIVATE';
}

interface S3UploadUrlResponse extends S3File {
  uploadUrl: string;
  publicUrl: string | null;
}
