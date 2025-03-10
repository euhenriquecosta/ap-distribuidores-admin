'use client'
import { createContext, useContext, useState, ReactNode } from "react"
import { DialogConfirm } from "../components/dialog-confirm"

interface DialogContextProps {
  open: (title: string, message: string, onConfirm: () => void) => void
  close: () => void
}

const DialogConfirmContext = createContext<DialogContextProps | undefined>(undefined)

export const useDialogConfirm = () => {
  const context = useContext(DialogConfirmContext)
  if (!context) {
    throw new Error("useDialogConfirm must be used within a DialogConfirmProvider")
  }
  return context
}

interface DialogProviderProps {
  children: ReactNode
}

export const DialogConfirmProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => { })

  const open = (dialogTitle: string, dialogMessage: string, confirmAction: () => void) => {
    setTitle(dialogTitle)
    setMessage(dialogMessage)
    setOnConfirm(() => confirmAction)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setTitle("")
    setMessage("")
    setOnConfirm(() => () => { })
  }

  return (
    <DialogConfirmContext.Provider value={{ open, close }}>
      {children}
      {isOpen && (
        <DialogConfirm
          isOpen={isOpen}
          title={title}
          message={message}
          onConfirm={onConfirm}
          onClose={close}
        />
      )}
    </DialogConfirmContext.Provider>
  )
}