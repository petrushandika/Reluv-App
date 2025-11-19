"use client";

import ImageDropzone from "@/features/sell/components/ImageDropzone";
import ListingEditor from "@/features/sell/components/ListingEditor";
import { useSellProduct } from "@/features/sell/hooks/useSellProduct";
import { ListingData } from "@/features/sell/types";
import React, { useState, useRef } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import AuthWarningModal from "@/shared/components/molecules/AuthWarningModal";
import Spinner from "@/shared/components/atoms/Spinner";

const Sell = () => {
  const { isAuthenticated, isHydrated } = useAuthStore();

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [listingData, setListingData] = useState<ListingData>({
    categoryId: null,
    name: "",
    description: "",
    price: "",
    condition: "",
    stock: 1,
    weight: "",
    length: "",
    width: "",
    height: "",
    size: "",
    customSize: "",
    color: "",
    customColor: "",
    conditionNote: "",
    isPreloved: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { listProduct, isLoading } = useSellProduct();

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setListingData((prev) => ({ ...prev, categoryId: null }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setListingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    listProduct(listingData, files);
  };

  if (!isHydrated) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-white w-full flex items-center justify-center p-4">
      <div className="container mx-auto px-6 md:px-20 xl:px-40 py-5">
        {!isAuthenticated() ? (
          <AuthWarningModal />
        ) : files.length === 0 ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <ImageDropzone
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              isDragging={isDragging}
            />
          </>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <ListingEditor
              files={files}
              removeFile={removeFile}
              listingData={listingData}
              handleInputChange={handleInputChange}
              setListingData={setListingData}
              isDragging={isDragging}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              onAddMoreClick={() => fileInputRef.current?.click()}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Sell;
