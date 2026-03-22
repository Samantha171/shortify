import { useEffect, useRef, useState, useCallback } from "react"

const COLORS = ["#4988C4", "#6aa8ff", "#2563eb", "#3b82f6", "#93c5fd"]
const PIXEL_SIZE = 12
const TRAIL_LENGTH = 30
const FADE_SPEED = 0.05

export function PixelCursorTrail() {
  const containerRef = useRef(null)
  const [pixels, setPixels] = useState([])
  const pixelIdRef = useRef(0)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef()

  const createPixel = useCallback((x, y) => {
    // Pick a random color from the theme palette
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    return {
      id: pixelIdRef.current++,
      x,
      y,
      opacity: 1,
      age: 0,
      color,
    }
  }, [])

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const x = e.clientX
      const y = e.clientY

      const dx = x - lastPositionRef.current.x
      const dy = y - lastPositionRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > PIXEL_SIZE) {
        const newPixel = createPixel(x, y)
        setPixels((prev) => [...prev.slice(-TRAIL_LENGTH), newPixel])
        lastPositionRef.current = { x, y }
      }
    }

    window.addEventListener("mousemove", handleGlobalMouseMove)
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove)
  }, [createPixel])

  useEffect(() => {
    const animate = () => {
      setPixels((prev) =>
        prev
          .map((pixel) => ({
            ...pixel,
            opacity: pixel.opacity - FADE_SPEED,
            age: pixel.age + 1,
          }))
          .filter((pixel) => pixel.opacity > 0),
      )
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[9999] select-none"
    >
      {pixels.map((pixel) => {
        // Calculate size based on age - older pixels are smaller
        const sizeMultiplier = Math.max(0.2, 1 - pixel.age / 50)
        const currentSize = PIXEL_SIZE * sizeMultiplier

        return (
          <div
            key={pixel.id}
            className="absolute pointer-events-none rounded-sm"
            style={{
              left: pixel.x - currentSize / 2,
              top: pixel.y - currentSize / 2,
              width: currentSize,
              height: currentSize,
              backgroundColor: pixel.color,
              opacity: pixel.opacity,
              boxShadow: `0 0 10px ${pixel.color}88`,
              transition: "width 0.15s ease-out, height 0.15s ease-out",
            }}
          />
        )
      })}

      {/* Subtle Hint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 hover:opacity-0 transition-opacity duration-1000">
        <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#4988C4]">
          Pixel Trail Active
        </span>
      </div>
    </div>
  )
}
