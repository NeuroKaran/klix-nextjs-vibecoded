
'use client'

import { FC, useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Input } from './Input'

interface PromptProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  title: string
  label: string
  defaultValue?: string
  type?: 'input' | 'textarea'
  labelClassName?: string
}

export const Prompt: FC<PromptProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  label,
  defaultValue = '',
  type = 'input',
  labelClassName = 'text-black',
}) => {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleConfirm = () => {
    onConfirm(value)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={title}
    >
      <label className={`block font-pixel text-sm mb-2 text-center ${labelClassName}`}>
        {label}
      </label>
      {type === 'input' ? (
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full"
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-48 bg-gray-100 border-2 border-gray-900 rounded-md p-2 font-pixel text-sm"
        />
      )}
    </Modal>
  )
}
