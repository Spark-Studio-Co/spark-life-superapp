"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface OrbProps {
  size?: number
  color?: string
  speed?: number
  className?: string
  onClick?: () => void
}

export function Orb({ size = 200, color = "#3b82f6", speed = 1, className = "", onClick }: OrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Устанавливаем размер canvas с учетом DPI экрана
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Функция для рисования орба
    const drawOrb = (time: number) => {
      if (!ctx) return

      // Очищаем canvas
      ctx.clearRect(0, 0, size, size)

      // Центр орба
      const centerX = size / 2
      const centerY = size / 2
      const radius = size * 0.35

      // Создаем градиент
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5)

      // Цвета градиента
      const baseColor = hexToRgb(color)
      if (!baseColor) return

      gradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.8)`)
      gradient.addColorStop(0.5, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.4)`)
      gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`)

      // Рисуем основной круг
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Добавляем волны
      const waveCount = 3
      const elapsedTime = time * speed * 0.001

      for (let i = 0; i < waveCount; i++) {
        const waveRadius = radius * (1 + 0.2 * Math.sin(elapsedTime + (i * Math.PI) / 4))
        const opacity = 0.4 - i * 0.1

        ctx.beginPath()
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Добавляем блики
      const highlightCount = 5
      for (let i = 0; i < highlightCount; i++) {
        const angle = elapsedTime * 0.5 + i * ((Math.PI * 2) / highlightCount)
        const distance = radius * 0.6
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance
        const highlightSize = size * 0.05 * (0.7 + 0.3 * Math.sin(elapsedTime * 2 + i))

        const highlightGradient = ctx.createRadialGradient(x, y, 0, x, y, highlightSize)

        highlightGradient.addColorStop(0, `rgba(255, 255, 255, 0.8)`)
        highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

        ctx.beginPath()
        ctx.arc(x, y, highlightSize, 0, Math.PI * 2)
        ctx.fillStyle = highlightGradient
        ctx.fill()
      }
    }

    // Функция анимации
    const animate = (timestamp: number) => {
      if (!timeRef.current) {
        timeRef.current = timestamp
      }

      const elapsed = timestamp - timeRef.current
      drawOrb(elapsed)
      animationRef.current = requestAnimationFrame(animate)
    }

    // Запускаем анимацию
    animationRef.current = requestAnimationFrame(animate)

    // Очистка при размонтировании
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [size, color, speed])

  // Вспомогательная функция для преобразования HEX в RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
      : null
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          cursor: onClick ? "pointer" : "default",
        }}
      />
    </motion.div>
  )
}
