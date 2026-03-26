'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function ImageGallery({ images, productName, isOutOfStock, discount }) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-cream to-blush/30 shadow-lg">
        {images?.[active] ? (
          <Image
            src={images[active]}
            alt={`${productName} - image ${active + 1}`}
            fill
            className="object-cover transition-all duration-300"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">🌸</div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-plum font-display font-bold text-xl px-6 py-3 rounded-full">
              Sold Out
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-plum text-white badge text-sm px-3 py-1.5">
            -{discount}%
          </div>
        )}

        {/* Dot indicators */}
        {images?.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  i === active ? 'bg-plum scale-125' : 'bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images?.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                i === active
                  ? 'border-plum shadow-md scale-105'
                  : 'border-blush hover:border-rose opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}