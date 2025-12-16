'use client';

import ImageDropzone from '@/features/(main)/sell/components/ImageDropzone';
import ListingEditor from '@/features/(main)/sell/components/ListingEditor';
import { useSellProduct } from '@/features/(main)/sell/hooks/useSellProduct';
import { ListingData } from '@/features/(main)/sell/types';
import React, { useState, useRef } from 'react';
import { useAuthStore } from '@/features/(auth)/store/auth.store';
import AuthWarningModal from '@/shared/components/common/AuthWarningModal';
import { toast } from 'sonner';
import Spinner from '@/shared/components/common/Spinner';

const Sell = () => {
  const { isAuthenticated, isHydrated } = useAuthStore();

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [listingData, setListingData] = useState<ListingData>({
    categoryId: null,
    name: '',
    description: '',
    price: '',
    condition: '',
    stock: 1,
    weight: '',
    length: '',
    width: '',
    height: '',
    size: '',
    customSize: '',
    color: '',
    customColor: '',
    conditionNote: '',
    isPreloved: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { listProduct, isLoading } = useSellProduct();

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const maxImages = 9;
      const currentCount = files.length;
      const remainingSlots = maxImages - currentCount;

      if (remainingSlots <= 0) {
        toast.warning('Upload Limit Reached', {
          description: `Maximum ${maxImages} images allowed. No images were added.`,
        });
        return;
      }

      if (newFiles.length > remainingSlots) {
        const filesToAdd = newFiles.slice(0, remainingSlots);
        const rejectedCount = newFiles.length - remainingSlots;

        setFiles((prev) => [...prev, ...filesToAdd]);

        toast.warning('Upload Limit Reached', {
          description: `Maximum ${maxImages} images allowed. ${rejectedCount} image(s) were not added.`,
        });
      } else {
        setFiles((prev) => [...prev, ...newFiles]);
      }
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
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full flex items-center justify-center p-3 sm:p-4">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-4 sm:py-5">
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
