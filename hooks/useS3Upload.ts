import { useRef, useCallback } from "react";
import { addToast } from "@heroui/react";

import { useFetch } from "./useFetch";

import API_ROUTE from "@/configs/api";
import { IAPIResponse } from "@/types/global";

interface S3UploadResult {
  imageKey: string;
}

interface UseS3UploadOptions {
  onUploadStart?: (file: File) => void;
  onUploadSuccess?: (imageUrl: string, file: File) => void;
  onUploadError?: (error: string, file: File) => void;
  showToasts?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseS3UploadReturn {
  uploadImage: (file: File) => Promise<string>;
  uploading: boolean;
  error: string | null;
}

export function useS3Upload(options: UseS3UploadOptions = {}): UseS3UploadReturn {
  const {
    onUploadStart,
    onUploadSuccess,
    onUploadError,
    showToasts = true,
    retryAttempts = 20,
    retryDelay = 250,
  } = options;

  const {
    data: uploadResult,
    error: uploadError,
    loading: uploading,
    fetch: uploadToS3,
  } = useFetch<IAPIResponse<S3UploadResult>>(API_ROUTE.S3.UPLOAD_IMAGE, {
    method: "POST",
    skip: true,
    options: {
      removeContentType: true,
    },
  });

  const uploadResultRef = useRef(uploadResult);
  const uploadErrorRef = useRef(uploadError);

  uploadResultRef.current = uploadResult;
  uploadErrorRef.current = uploadError;

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      try {
        onUploadStart?.(file);

        if (showToasts) {
          addToast({
            title: "Uploading Image",
            description: `Uploading ${file.name}...`,
            color: "primary",
          });
        }

        const formData = new FormData();

        formData.append("image", file);

        uploadResultRef.current = null;
        uploadErrorRef.current = null;

        await uploadToS3({ body: formData });

        return new Promise<string>((resolve, reject) => {
          let retry = retryAttempts;

          const checkResult = () => {
            const result = uploadResultRef.current;
            const error = uploadErrorRef.current;

            if (!error && result && result.results && result.results.imageKey) {
              const imageUrl = process.env.NEXT_PUBLIC_BASE_API_URL + API_ROUTE.S3.GET_IMAGE(result.results.imageKey);

              onUploadSuccess?.(imageUrl, file);

              if (showToasts) {
                addToast({
                  title: "Image Uploaded",
                  description: "Image uploaded successfully!",
                  color: "success",
                });
              }

              resolve(imageUrl);
            } else if (error) {
              onUploadError?.(error, file);

              if (showToasts) {
                addToast({
                  title: "Upload Failed",
                  description: "Failed to upload image. Please try again.",
                  color: "danger",
                });
              }

              reject(new Error(error));
            } else if (retry > 0) {
              retry--;
              setTimeout(checkResult, retryDelay);
            } else {
              const timeoutError = "Image upload timed out.";

              onUploadError?.(timeoutError, file);

              if (showToasts) {
                addToast({
                  title: "Upload Timeout",
                  description: "Image upload timed out. Please try again.",
                  color: "danger",
                });
              }

              reject(new Error(timeoutError));
            }
          };

          checkResult();
        }).finally(() => {
          uploadResultRef.current = null;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred while uploading the image.";


        onUploadError?.(errorMessage, file);


        if (showToasts) {
          addToast({
            title: "Upload Error",
            description: "An error occurred while uploading the image.",
            color: "danger",
          });
        }

        throw error;
      }
    },
    [
      uploadToS3,
      onUploadStart,
      onUploadSuccess,
      onUploadError,
      showToasts,
      retryAttempts,
      retryDelay,
    ]
  );

  return {
    uploadImage,
    uploading,
    error: uploadError,
  };
}
