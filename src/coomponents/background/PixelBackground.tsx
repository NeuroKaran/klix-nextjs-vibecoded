'use client'

export function PixelBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Pixel Grid */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 22px),
              repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 22px)
            `
          }}
        />
      </div>

      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            <div className="relative w-1 h-1 bg-gray-800">
              <div className="absolute top-0.5 -left-1.5 w-2 h-px bg-gray-800" />
              <div className="absolute -top-1.5 left-0.5 w-px h-2 bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}