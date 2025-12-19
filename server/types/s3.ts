export interface S3CreateUploadUrlArgs {
  contentType: string;
  key: string;
  isPublic: boolean;
}

export interface S3File {
  bucket: string;
  key: string;
  visibility: 'PUBLIC' | 'PRIVATE';
}

export interface S3UploadUrlResponse extends S3File {
  uploadUrl: string;
  publicUrl: string | null;
}
