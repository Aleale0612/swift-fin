import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DebtForm } from "@/components/forms/DebtForm";

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt?: any;
  onSuccess?: () => void;
}

export function DebtModal({ isOpen, onClose, debt, onSuccess }: DebtModalProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {debt ? "Edit Debt/Receivable" : "Add New Debt/Receivable"}
          </DialogTitle>
        </DialogHeader>
        
        <DebtForm 
          debt={debt}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}