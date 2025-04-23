import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import Button from './Button'

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T, idx: number) => React.ReactNode
  className?: string
  onLoadMore?: () => void
  loadingMore?: boolean
  bottomLeftSlot?: React.ReactNode
  onIndexChange?: (index: number) => void
}

export interface CarouselRef {
  scrollToIndex: (index: number) => void
  currentIndex: number
  resetIndex: () => void
}

// Funzione factory per componente generico
function createCarousel<T>() {
  return forwardRef<CarouselRef, CarouselProps<T>>(function Carousel(
    { items, renderItem, className = '', onLoadMore, loadingMore, bottomLeftSlot, onIndexChange },
    ref
  ) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      scrollToIndex,
      currentIndex,
      resetIndex: () => {
        setCurrentIndex(0)
        if (onIndexChange) onIndexChange(0)
      },
    }))

    function scrollToIndex(index: number) {
      setCurrentIndex(index)
      if (onIndexChange) onIndexChange(index)
      if (carouselRef.current) {
        const container = carouselRef.current
        const card = container.querySelectorAll('.carousel-item')[index] as HTMLElement
        if (card) {
          container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
        }
      }
    }

    const handlePrev = () => {
      if (currentIndex > 0) scrollToIndex(currentIndex - 1)
    }

    const handleNext = () => {
      if (currentIndex < items.length - 1) {
        scrollToIndex(currentIndex + 1)
      } else if (onLoadMore && !loadingMore) {
        onLoadMore()
      }
    }

    return (
      <div className={`relative ${className}`}>
        <div
          ref={carouselRef}
          className="overflow-x-auto px-8 scrollbar-none"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-4 min-w-full pb-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`carousel-item flex-shrink-0 w-full max-w-[480px] flex flex-col items-center bg-white/90 border border-primary/20 shadow-md rounded-2xl p-4 transition hover:shadow-xl hover:border-primary/40 ${idx === currentIndex ? '' : 'opacity-80'}`}
                style={{ minWidth: '100%', maxWidth: '100%' }}
              >
                {renderItem(item, idx)}
              </div>
            ))}
          </div>
        </div>
        {/* Sezione bottoni e slot sotto il carosello */}
        {items.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            {bottomLeftSlot && (
              <div className="flex justify-start w-full sm:w-auto">{bottomLeftSlot}</div>
            )}
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Button
                type="button"
                aria-label="Scroll left"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="!p-1 w-8 h-8 min-w-0"
                rounded
                variant="glass"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M15 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button
                type="button"
                aria-label={
                  currentIndex === items.length - 1 && onLoadMore ? 'Load more' : 'Scroll right'
                }
                onClick={handleNext}
                disabled={loadingMore}
                className="!p-1 w-8 h-8 min-w-0 flex items-center justify-center text-xs"
                rounded
                variant={currentIndex === items.length - 1 && onLoadMore ? 'warning' : 'glass'}
              >
                {loadingMore ? (
                  <svg
                    className="animate-spin"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity=".2"
                    />
                    <path
                      d="M4 12a8 8 0 018-8"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : currentIndex === items.length - 1 && onLoadMore ? (
                  <span className="flex items-center gap-2">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Load more
                  </span>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M9 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  })
}

export default createCarousel
