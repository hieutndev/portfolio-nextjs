# useS3Upload Hook

A reusable React hook for uploading images to S3 with built-in error handling, retry logic, and toast notifications.

## Features

- **Automatic retry mechanism** with configurable attempts and delay
- **Built-in toast notifications** for upload progress and results
- **Customizable callbacks** for upload lifecycle events
- **Error handling** with detailed error messages
- **TypeScript support** with full type safety

## Basic Usage

```typescript
import { useS3Upload } from "@/hooks/useS3Upload";

function MyComponent() {
  const { uploadImage, uploading, error } = useS3Upload();

  const handleFileUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      console.log("Image uploaded successfully:", imageUrl);
      // Use the imageUrl as needed
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        }}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## Advanced Usage with Options

```typescript
import { useS3Upload } from "@/hooks/useS3Upload";

function MyAdvancedComponent() {
  const { uploadImage, uploading, error } = useS3Upload({
    // Show toast notifications (default: true)
    showToasts: true,
    
    // Number of retry attempts (default: 20)
    retryAttempts: 10,
    
    // Delay between retries in ms (default: 250)
    retryDelay: 500,
    
    // Callback when upload starts
    onUploadStart: (file) => {
      console.log(`Starting upload for ${file.name}`);
      // You can show custom loading state here
    },
    
    // Callback when upload succeeds
    onUploadSuccess: (imageUrl, file) => {
      console.log(`Upload successful: ${imageUrl}`);
      // You can update your state or perform other actions
    },
    
    // Callback when upload fails
    onUploadError: (error, file) => {
      console.error(`Upload failed for ${file.name}:`, error);
      // You can show custom error handling
    },
  });

  // Rest of your component logic...
}
```

## Usage in MDX Editor

```typescript
import { useS3Upload } from "@/hooks/useS3Upload";

function MyEditorComponent() {
  const { uploadImage } = useS3Upload({
    showToasts: true,
    onUploadSuccess: (imageUrl, file) => {
      console.log("Image ready for editor:", imageUrl);
    },
  });

  return (
    <MDXEditor
      imageUploadHandler={uploadImage}
      // other props...
    />
  );
}
```

## API Reference

### Hook Parameters

```typescript
interface UseS3UploadOptions {
  onUploadStart?: (file: File) => void;
  onUploadSuccess?: (imageUrl: string, file: File) => void;
  onUploadError?: (error: string, file: File) => void;
  showToasts?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}
```

### Return Value

```typescript
interface UseS3UploadReturn {
  uploadImage: (file: File) => Promise<string>;
  uploading: boolean;
  error: string | null;
}
```

### Options

- **`onUploadStart`**: Called when upload begins
- **`onUploadSuccess`**: Called when upload completes successfully
- **`onUploadError`**: Called when upload fails
- **`showToasts`**: Whether to show toast notifications (default: `true`)
- **`retryAttempts`**: Number of retry attempts (default: `20`)
- **`retryDelay`**: Delay between retries in milliseconds (default: `250`)

### Returns

- **`uploadImage`**: Function to upload a file, returns a Promise with the image URL
- **`uploading`**: Boolean indicating if an upload is in progress
- **`error`**: Error message if upload failed, null otherwise

## Error Handling

The hook handles various error scenarios:

1. **Network errors**: Automatic retry with exponential backoff
2. **Server errors**: Proper error messages and toast notifications
3. **Timeout errors**: Configurable timeout with retry mechanism
4. **File validation**: Handled by the server-side API

## Toast Notifications

When `showToasts` is enabled (default), the hook will show:

- **Upload start**: Blue toast with "Uploading Image" message
- **Upload success**: Green toast with "Image Uploaded" message
- **Upload failure**: Red toast with "Upload Failed" message
- **Upload timeout**: Red toast with "Upload Timeout" message

## Dependencies

- `@heroui/react` for toast notifications
- `useFetch` hook for API calls
- API configuration from `@/configs/api`
