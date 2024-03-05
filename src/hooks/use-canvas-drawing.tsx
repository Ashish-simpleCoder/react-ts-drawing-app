import { useCallback, useRef, useState } from 'react'
import { useCanvasAtomValue } from '../atom/canvas.atom'
import useSyncedRef from './use-synced-ref'

export default function useCanvasDrawing() {
   const [isDrawing, setIsDrawing] = useState(false)
   const isDrawingRef = useSyncedRef(isDrawing)
   const { ref } = useCanvasAtomValue()

   const prevPointRefRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
   const currentWorkingPathRef = useRef<Array<[number, number]>>([])
   const moveToPathRef = useRef<Array<[number, number]>>([])

   const startDrawing = useCallback(() => setIsDrawing(true), [])
   const stopDrawing = useCallback(() => {
      setIsDrawing(false)
      prevPointRefRef.current = null
      currentWorkingPathRef.current = []
      moveToPathRef.current = []
   }, [])

   const drawOnCanvas = useCallback((e: MouseEvent) => {
      if (!isDrawingRef.current) return

      const ctx = ref.current?.getContext('2d')!
      const rect = ref.current?.getBoundingClientRect()!

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const left = e.pageX
      const top = e.pageY

      let currentPoint = { x, y, left, top }
      let startPoint = prevPointRefRef.current ?? currentPoint
      currentWorkingPathRef.current.push([startPoint.x, startPoint.y])
      moveToPathRef.current.push([currentPoint.x, currentPoint.y])

      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.lineWidth = 3

      ctx.beginPath()
      ctx.moveTo(startPoint.x, startPoint.y)
      ctx.lineTo(currentPoint.x, currentPoint.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.globalCompositeOperation = 'source-over'
      ctx.arc(startPoint.x, startPoint.y, 1.5, 0, 2 * Math.PI, true)
      ctx.fill()

      prevPointRefRef.current = currentPoint
   }, [])

   return { isDrawing, setIsDrawing, startDrawing, stopDrawing, drawOnCanvas }
}
