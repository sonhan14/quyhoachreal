import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadImage({ onDrop }) {
  const handleDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      onDrop(acceptedFiles);
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === "file-too-large") {
            console.error(`Error: ${err.message}`);
          }

          if (err.code === "file-invalid-type") {
            console.error(`Error: ${err.message}`);
          }
        });
      });
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: 70 * 1024 * 1024,
    multiple: false,
    onDrop: handleDrop,
    accept: "image/*",
  });

  return (
    <div
      {...getRootProps()}
      className="bg-white rounded-md text-center p-5 cursor-pointer z-[99999] w-fit absolute top-0 left-0 "
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </div>
  );
}
