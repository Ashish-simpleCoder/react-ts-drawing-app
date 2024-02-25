import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { CANVAS_CLRS, useCanvasAtom, useCanvasAtomValue } from '../atom/canvas.atom'
import { useEventListener } from '../hooks/use-event-listener'

export default function Canvas() {
   const [isDrawing, setIsDrawing] = useState(false)
   const { ref, activeClr, opacity } = useCanvasAtomValue()

   useEventListener(
      () => ref.current,
      'mousedown',
      (e) => {
         setIsDrawing(true)
      }
   )

   useEventListener(
      () => ref.current,
      'mousemove',
      (e) => {
         if (!isDrawing) return

         const ctx = ref.current?.getContext('2d')!
         const rect = ref.current?.getBoundingClientRect()!

         const x = e.clientX - rect.left
         const y = e.clientY - rect.top
         const left = e.pageX
         const top = e.pageY

         let startPoint = { x, y, left, top }

         ctx.lineJoin = 'round'
         ctx.lineCap = 'round'
         ctx.lineWidth = 10

         ctx.beginPath()
         ctx.moveTo(startPoint.x, startPoint.y)
         ctx.lineTo(startPoint.x, startPoint.y)
         ctx.stroke()
         ctx.beginPath()
         ctx.globalCompositeOperation = 'source-over'
         ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
         ctx.fill()
      }
   )

   useEventListener(
      () => ref.current,
      'mouseup',
      (e) => {
         setIsDrawing(false)
      }
   )

   useLayoutEffect(() => {
      ref.current!.width = window.innerWidth
      ref.current!.height = window.innerHeight
   }, [])

   useEffect(() => {
      const ctx = ref.current?.getContext('2d')!
      ctx.strokeStyle = CANVAS_CLRS[activeClr]
      ctx.fillStyle = CANVAS_CLRS[activeClr]
   }, [activeClr])

   useEffect(() => {
      const ctx = ref.current?.getContext('2d')!
      ctx.globalAlpha = opacity
   }, [opacity])

   return <canvas ref={ref} className='bg-[#131315]'></canvas>
}
