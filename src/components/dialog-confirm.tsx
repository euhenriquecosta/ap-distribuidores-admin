import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog"

interface DialogConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string;
}

export const DialogConfirm: React.FC<DialogConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose onClick={onClose} className="rounded-md border-gray-200 text-white bg-slate-900 border py-2 px-3">
            Cancelar
          </DialogClose>
          <DialogClose onClick={onConfirm} className="rounded-md border-gray-200 text-white border  bg-red-500 py-2 px-3">
            Confirmar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}