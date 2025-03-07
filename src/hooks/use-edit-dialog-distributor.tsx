"use client";

import { createContext, useContext, useState } from "react";

interface EditDialogDistributorContextProps {
  isOpen: boolean;
  distributorId: string;
  openEditDialog: (id: string) => void;
  closeEditDialog: () => void;
}

const EditDialogDistributorContext = createContext<EditDialogDistributorContextProps | undefined>(undefined);

export function EditDialogDistributorProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [distributorId, setDistributorId] = useState("")

  const openEditDialog = (id: string) => {
    setIsOpen(true);
    setDistributorId(id)
  }
  const closeEditDialog = () => setIsOpen(false);

  return (
    <EditDialogDistributorContext.Provider value={{ isOpen, openEditDialog, closeEditDialog, distributorId }}>
      {children}
    </EditDialogDistributorContext.Provider>
  );
}

export function useEditDialogDistributor() {
  const context = useContext(EditDialogDistributorContext);
  if (!context) {
    throw new Error("useDialogDistributor deve ser usado dentro de um DialogDistributorProvider");
  }
  return context;
}