
'use client'

import { FC, ReactNode } from 'react'
import { Button } from './Button'
import { Card } from './Card'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  children: ReactNode
  confirmText?: string
  cancelText?: string
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white">
        <h2 className="font-pixel text-xl text-klix-orange mb-6 text-center">
          {title}
        </h2>
        <div className="mb-6 text-center">{children}</div>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </div>
      </Card>
    </div>
  )
}
