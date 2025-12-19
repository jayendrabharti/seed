'use client';
import { cn } from '@/lib/utils';
import { useSession } from '@/providers/SessionProvider';
import { PencilIcon, UploadIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useState, useEffect, useMemo, useTransition } from 'react';
import { toast } from 'sonner';
import { clientTrpc } from '@seed/api/client';
import NextImage from 'next/image';
import { Spinner } from '../ui/spinner';
import { cropImageToSquare } from '@/utils/images';

export default function UserAvatar({ size = 20 }: { size?: number }) {
  const { user } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, startUploading] = useTransition();

  const clientTrpcUtils = clientTrpc.useUtils();
  const profilePictureMutation = clientTrpc.auth.setProfilePicture.useMutation({
    onSuccess: async () => {
      await clientTrpcUtils.auth.getUser.refetch();
    },
  });

  const allowedFormats = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Validate file format
    if (!allowedFormats.includes(selectedFile.type)) {
      toast.error(
        'Invalid file format. Please upload jpg, png, gif, or webp files only.',
      );
      e.target.value = ''; // Reset input
      return;
    }

    try {
      // Crop image to square
      const { croppedFile, previewUrl } = await cropImageToSquare(selectedFile);
      setFile(croppedFile);
      setPreview(previewUrl);
    } catch (error) {
      toast.error('Failed to process image');
      console.error(error);
    }

    // Reset input
    e.target.value = '';
  };

  const handleClearFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image first');
      return;
    }
    startUploading(async () => {
      const {
        uploadUrl,
        publicUrl,
      }: TrpcAppRouterOutputType['auth']['getUserProfileUploadUrl'] =
        await clientTrpcUtils.auth.getUserProfileUploadUrl.fetch({
          contentType: file.type,
        });

      if (!uploadUrl) {
        toast.error('Failed to get upload URL');
        return;
      }

      try {
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        if (user?.picture !== publicUrl) {
          const { success } = await profilePictureMutation.mutateAsync({
            imageUrl: publicUrl,
          });
          if (!success) {
            throw new Error('Failed to update profile picture');
          }
        }
        setOpen(false);
        toast.success('Upload successful');
        handleClearFile();
      } catch (error) {
        toast.error('Upload failed');
        console.error(error);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (user)
    return (
      <Dialog modal={false} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className={cn(
              'group relative overflow-hidden rounded-full',
              `size-${size}`,
            )}
          >
            <NextImage
              key={user.updatedAt.toString()}
              className="h-full w-full object-cover transition-all duration-200 ease-in-out group-hover:brightness-0"
              src={user?.picture || 'images/blankProfilePicture.jpg'}
              alt={user?.name || 'User'}
              width={size * 4}
              height={size * 4}
              unoptimized
            />
            <PencilIcon className="absolute top-1/2 left-1/2 -translate-1/2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Profile Image</DialogTitle>
          </DialogHeader>
          {preview ? (
            <div className="relative mx-auto w-full max-w-sm">
              <Image
                src={preview}
                alt="Preview"
                width={400}
                height={400}
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleClearFile}
              >
                <XIcon className="size-4" />
              </Button>
              {uploading && (
                <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center bg-black/90">
                  <Spinner className="size-20" />
                  <span className="text-extrabold text-2xl">Uploading...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted text-muted-foreground relative mx-auto w-full rounded-2xl border-4 border-dashed text-center">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center gap-3 p-5">
                <UploadIcon className="size-20" />
                <Button size="sm">Browse</Button>
                <span className="text-xs">Drop a file here</span>
                <span className="text-sm">
                  File support: jpg, png, gif, webp
                </span>
              </div>
            </div>
          )}
          <DialogFooter className="gap-4 sm:justify-center">
            <Button
              onClick={handleUpload}
              className="flex-1"
              disabled={!file || profilePictureMutation.isPending}
            >
              Upload
            </Button>
            <DialogClose asChild>
              <Button variant={'destructive'} className="flex-1">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
