import { useEffect, useLayoutEffect } from 'react'
import { CANVAS_CLRS, getCanvasCtx, useCanvasAtomDispatch, useCanvasAtomValue } from '../atom/canvas.atom'
import { useEventListener } from '../hooks/use-event-listener'
import useCanvasDrawing from '../hooks/use-canvas-drawing'

export default function Canvas() {
   const { ref, activeClr, opacity } = useCanvasAtomValue()
   const { startDrawing, stopDrawing, drawOnCanvas } = useCanvasDrawing()
   const cavnasDispatch = useCanvasAtomDispatch()

   // prettier-ignore
   useEventListener(() => ref.current, 'pointerdown', (e) => {
      startDrawing()
      drawOnCanvas(e)
      cavnasDispatch(atom=>{
         atom.canvas_path_histories = atom.canvas_path_histories.slice(0,atom.history_cursor+1)
         localStorage.setItem('canvas_path_histories', JSON.stringify(atom.canvas_path_histories))
         return atom
      })
   })
   useEventListener(() => ref.current, 'pointermove', drawOnCanvas)
   useEventListener(() => ref.current, 'pointerup', stopDrawing)

   useLayoutEffect(() => {
      ref.current!.width = window.innerWidth
      ref.current!.height = window.innerHeight
   }, [])

   useEffect(() => {
      const ctx = getCanvasCtx()
      ctx.strokeStyle = CANVAS_CLRS[activeClr]
      ctx.fillStyle = CANVAS_CLRS[activeClr]
   }, [activeClr])

   useEffect(() => {
      const ctx = getCanvasCtx()
      ctx.globalAlpha = opacity
   }, [opacity])

   return <canvas ref={ref} className='bg-[#131315] cursor-crosshair'></canvas>
}
