import React from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  overlayClassName?: string
  contentClassName?: string
}

export default function Modal({ open, onClose, children, overlayClassName = '', contentClassName = '' }: ModalProps) {
  if (!open) return null
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-50 ${overlayClassName}`}
        onClick={onClose}
        aria-label="Chiudi modale"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          className={`bg-white border border-neutral-300 rounded-xl shadow-lg p-6 min-w-[240px] flex flex-col items-center pointer-events-auto ${contentClassName}`}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  )
}
