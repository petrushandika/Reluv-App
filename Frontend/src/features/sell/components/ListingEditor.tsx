"use client";

import React from "react";
import ImagePreviewGrid from "./ImagePreviewGrid";
import ListingForm from "./ListingForm";
import { ListingData } from "../types";

interface ListingEditorProps {
  files: File[];
  removeFile: (index: number) => void;
  listingData: ListingData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setListingData: React.Dispatch<React.SetStateAction<ListingData>>;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onAddMoreClick: () => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

const ListingEditor = (props: ListingEditorProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <ImagePreviewGrid
        files={props.files}
        removeFile={props.removeFile}
        isDragging={props.isDragging}
        onDragOver={props.handleDragOver}
        onDragLeave={props.handleDragLeave}
        onDrop={props.handleDrop}
        onAddMoreClick={props.onAddMoreClick}
      />
      <ListingForm
        listingData={props.listingData}
        setListingData={props.setListingData}
        handleInputChange={props.handleInputChange}
        handleSubmit={props.handleSubmit}
        isLoading={props.isLoading}
      />
    </div>
  );
};

export default ListingEditor;
