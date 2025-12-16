"use client";

import StoreModal from "./StoreModal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  return (
    <StoreModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center gap-2"
          >
            {isDeleting ? "Deleting..." : "Delete Item"}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{itemName}"</span>?
        </p>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            This action cannot be undone. All data associated with this item will be permanently removed.
          </p>
        </div>
      </div>
    </StoreModal>
  );
}
