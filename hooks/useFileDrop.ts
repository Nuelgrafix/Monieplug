import { useState, useCallback } from 'react';

export interface UseFileDropOptions {
  acceptedTypes?: string[]; // e.g., ["image/jpeg", "image/png"]
  multiple?: boolean; // Allow multiple files, defaults to false
}

export default function useFileDrop(options?: UseFileDropOptions) {
  const { acceptedTypes = [], multiple = false } = options || {};

  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      const acceptedFiles =
        acceptedTypes.length > 0
          ? droppedFiles.filter(file => acceptedTypes.includes(file.type))
          : droppedFiles;
      if (!multiple && acceptedFiles.length > 0) {
        setFiles([acceptedFiles[0]]);
      } else {
        setFiles(acceptedFiles);
      }
    },
    [acceptedTypes, multiple]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputFiles = e.target.files ? Array.from(e.target.files) : [];
      const acceptedFiles =
        acceptedTypes.length > 0
          ? inputFiles.filter(file => acceptedTypes.includes(file.type))
          : inputFiles;
      if (!multiple && acceptedFiles.length > 0) {
        setFiles([acceptedFiles[0]]);
      } else {
        setFiles(acceptedFiles);
      }
    },
    [acceptedTypes, multiple]
  );

  // Mimic the react-dropzone API by returning getter props for the drop container and file input
  const getRootProps = () => ({
    onDragOver,
    onDragLeave,
    onDrop,
    // Optional: you can add an onClick handler if needed
  });

  const getInputProps = () => ({
    type: 'file',
    onChange: onInputChange,
    accept: acceptedTypes.join(','),
    multiple,
  });

  return { files, isDragActive, getRootProps, getInputProps };
}
