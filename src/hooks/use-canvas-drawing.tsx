import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import {
   CANVAS_CLRS,
   getCanvasActiveClr,
   getCanvasCtx,
   useCanvasAtomDispatch,
   useCanvasAtomValue,
} from '../atom/canvas.atom'
import useSyncedRef from './use-synced-ref'
import useCanvasHistory from './use-canvas-history'

export default function useCanvasDrawing() {
   const [isDrawing, setIsDrawing] = useState(false)
   const isDrawingRef = useSyncedRef(isDrawing)
   const { ref, activeClr, opacity } = useCanvasAtomValue()
   const canvasDispatch = useCanvasAtomDispatch()

   const prevPointRefRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
   const currentWorkingPathRef = useRef<Array<[number, number]>>([])
   const moveToPathRef = useRef<Array<[number, number]>>([])
   const { clonedCanvasPath } = useCanvasHistory()

   const startDrawing = useCallback(() => setIsDrawing(true), [])

   const stopDrawing = useCallback(() => {
      setIsDrawing(false)
      flushSync(() => {
         if (currentWorkingPathRef.current.length > 0) {
            canvasDispatch((atom) => {
               atom.canvas_path_histories.push({ color: activeClr, opacity, path: currentWorkingPathRef.current })
               localStorage.setItem('canvas_path_histories', JSON.stringify(atom.canvas_path_histories))
               atom.canvas_path_histories = [...atom.canvas_path_histories]
               return atom
            })
         }
      })
      prevPointRefRef.current = null
      currentWorkingPathRef.current = []
      moveToPathRef.current = []
   }, [activeClr, opacity])

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

      const active_canvas_clr = getCanvasActiveClr()

      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.lineWidth = 3
      ctx.strokeStyle = active_canvas_clr
      ctx.fillStyle = active_canvas_clr

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

   useEffect(() => {
      const ctx = getCanvasCtx()
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (clonedCanvasPath.length == 0) return

      const drawInitialCanvasPath = () => {
         clonedCanvasPath.forEach((activePath) => {
            let current_point_index = 0

            const draw = () => {
               const { color, opacity, path } = activePath
               ctx.strokeStyle = CANVAS_CLRS[color]
               ctx.fillStyle = CANVAS_CLRS[color]
               ctx.globalAlpha = opacity
               ctx.lineJoin = 'round'
               ctx.lineCap = 'round'
               ctx.lineWidth = 3

               if (current_point_index >= path.length) return

               ctx.beginPath()
               // previous-path
               ctx.moveTo(path[current_point_index][0], path[current_point_index][1])

               // current-path
               // prettier-ignore
               path[current_point_index + 1]?.[0] && ctx.lineTo(path[current_point_index + 1][0], path[current_point_index + 1][1])
               ctx.stroke()

               current_point_index++
               draw()
            }

            draw()
         })
      }

      try {
         drawInitialCanvasPath()
      } catch (err) {
         console.log(err)
      }
   }, [clonedCanvasPath])

   return { isDrawing, setIsDrawing, startDrawing, stopDrawing, drawOnCanvas }
}

// finalPaths -> Array<[number, number][]>
// old-structure
// useEffect(() => {
//    const ctx = ref.current?.getContext('2d')!

//    // ctx.strokeStyle = CANVAS_CLRS[activeClr]
//    // ctx.fillStyle = CANVAS_CLRS[activeClr]
//    // ctx.globalAlpha = opacity

//    if (finalPaths.length == 0) return

//    const drawInitialCanvasPath = () => {
//       let current_path = 0
//       let current_point = 0

//       const draw = () => {
//          // if (current_path >= finalPaths.length) return
//          if (current_path >= finalPaths.length && current_point >= finalPaths[current_path].length) return

//          // increment the path and reset current point
//          // one mouse-down draw will be one path -> it's coordinates are current_point
//          if (current_point >= finalPaths[current_path].length) {
//             // if (current_path < finalPaths.length-1) {
//             current_path++
//             current_point = 0
//             // }
//          }
//          if (!finalPaths[current_path]) return

// ctx.lineJoin = 'round'
// ctx.lineCap = 'round'
// ctx.lineWidth = 3
//          ctx.strokeStyle = CANVAS_CLRS[activeClr]
//          ctx.fillStyle = CANVAS_CLRS[activeClr]
//          ctx.globalAlpha = opacity

//          ctx.beginPath()
//          ctx.moveTo(finalPaths[current_path][current_point][0], finalPaths[current_path][current_point][1])
//          finalPaths[current_path][current_point + 1]?.[0] &&
//             ctx.lineTo(
//                finalPaths[current_path][current_point + 1][0],
//                finalPaths[current_path][current_point + 1][1]
//             )
//          ctx.stroke()

//          ctx.beginPath()
//          ctx.globalCompositeOperation = 'source-over'
//          ctx.arc(
//             finalPaths[current_path][current_point][0],
//             finalPaths[current_path][current_point][1],
//             1.5,
//             0,
//             2 * Math.PI
//          )

//          ctx.fill()

//          current_point++
//          draw()
//       }

//       draw()
//    }
//    try {
//       drawInitialCanvasPath()
//    } catch (err) {
//       console.log(err)
//    }
// }, [])
