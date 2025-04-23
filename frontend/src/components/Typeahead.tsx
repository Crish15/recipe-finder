import React, { useState, useRef, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom'
import Input from './Input'

interface TypeaheadProps<T> {
  suggestions: T[]
  value: string
  onInputChange: (value: string) => void
  onSelect: (item: T | string) => void
  getLabel: (item: T) => string
  getIcon?: (item: T) => React.ReactNode
  placeholder?: string
  allowCustom?: boolean
  className?: string
}

export function Typeahead<T>({
  suggestions,
  value,
  onInputChange,
  onSelect,
  getLabel,
  getIcon,
  placeholder,
  allowCustom = true,
  className = '',
}: TypeaheadProps<T>) {
  const [show, setShow] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null)

  const filtered = suggestions.filter((s) =>
    getLabel(s).toLowerCase().includes(value.toLowerCase())
  )

  useLayoutEffect(() => {
    if (show && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setMenuPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [show, value])

  const menu =
    show && (filtered.length > 0 || (allowCustom && value.trim())) && menuPos
      ? ReactDOM.createPortal(
          <div
            className="bg-white border border-primary/20 rounded-lg shadow z-[9999] mt-1 max-h-56 overflow-y-auto"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              position: 'absolute',
            }}
          >
            {filtered.map((s, idx) => (
              <button
                key={getLabel(s) + idx}
                type="button"
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-primary/10 text-left"
                onMouseDown={() => onSelect(s)}
              >
                {getIcon && <span className="text-xl">{getIcon(s)}</span>} {getLabel(s)}
              </button>
            ))}
            {allowCustom &&
              value.trim() &&
              !suggestions.some((s) => getLabel(s).toLowerCase() === value.toLowerCase()) && (
                <button
                  type="button"
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-primary/10 text-left"
                  onMouseDown={() => onSelect(value.trim())}
                >
                  <span className="text-xl">➕</span> Add "{value.trim()}"
                </button>
              )}
          </div>,
          document.body
        )
      : null

  return (
    <div className={`relative w-full ${className}`}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 100)}
        className="flex-1 w-full border rounded px-3 py-2 outline-none"
        autoComplete="off"
      />
      {menu}
    </div>
  )
}
export default Typeahead
