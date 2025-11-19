"use client";

import React from "react";
import { UploadCloud } from "lucide-react";

interface ImageDropzoneProps {
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  isDragging: boolean;
}

const ImageDropzone = ({
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  isDragging,
}: ImageDropzoneProps) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-80 rounded-lg border-2 border-dashed transition-colors duration-300 ${
        isDragging ? "border-sky-400 bg-sky-200" : "border-sky-500 bg-sky-100"
      } text-sky-800 cursor-pointer`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      <div className="text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-sky-500 opacity-80" />
        <button
          type="button"
          className="mt-4 px-6 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition-colors"
        >
          Select photos
        </button>
        <p className="mt-2 text-sm text-sky-700 opacity-90">
          or drag photos here
        </p>
        <p className="mt-1 text-xs text-sky-600 opacity-70">(Up to 9 Photos)</p>
      </div>
    </div>
  );
};

export default ImageDropzone;
