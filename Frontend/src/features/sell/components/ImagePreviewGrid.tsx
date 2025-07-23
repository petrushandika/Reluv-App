"use client";

import React from "react";
import { ImagePlus, X, Info } from "lucide-react";

interface ImagePreviewGridProps {
  files: File[];
  removeFile: (index: number) => void;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onAddMoreClick: () => void;
}

const ImagePreviewGrid = ({
  files,
  removeFile,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onAddMoreClick,
}: ImagePreviewGridProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {files.map((file, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview ${index}`}
              className="w-full h-full object-cover rounded-md border-2 border-transparent group-hover:border-sky-500"
              onLoad={(e) =>
                URL.revokeObjectURL((e.target as HTMLImageElement).src)
              }
            />
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded">
                COVER
              </div>
            )}
            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {files.length < 10 && (
          <div
            className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed transition-colors duration-300 ${
              isDragging
                ? "border-sky-400 bg-sky-200"
                : "border-sky-500 bg-sky-100"
            } text-sky-800 cursor-pointer`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={onAddMoreClick}
          >
            <ImagePlus className="h-8 w-8 text-sky-500" />
            <p className="mt-1 text-xs text-center">Add more</p>
          </div>
        )}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <Info className="w-4 h-4 mr-2 text-sky-600" />
        <span>Tip: Drag and drop to re-arrange photos.</span>
      </div>
    </div>
  );
};

export default ImagePreviewGrid;
