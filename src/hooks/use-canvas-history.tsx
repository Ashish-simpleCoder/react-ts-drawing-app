import { useEffect, useState } from 'react'
import { useEventListener } from './use-event-listener'
import useSyncedRef from './use-synced-ref'
import { useCanvasAtomValue, useCanvasHistoryIndex } from '../atom/canvas.atom'

export default function useCanvasHistory() {
   const { canvas_path_histories } = useCanvasAtomValue()
   const { history_index, setHistoryIndex } = useCanvasHistoryIndex()
   const [pressed_keys, setPressedKeys] = useState<string[]>([])
   const [clonedCanvasPath, setClonedCanvasPath] = useState(canvas_path_histories)
   const canvasPathsRef = useSyncedRef(canvas_path_histories)

   const handleKeyDown = (e: KeyboardEvent) => {
      if (ALLOWED_KEYS.includes(e.key)) {
         setPressedKeys((keys) => {
            if (keys.length < 3 && !keys.includes(e.key)) {
               return [...keys, e.key]
            }
            return keys
         })
      }
   }

   const handleKeyUp = (_e: KeyboardEvent) => {
      setTimeout(() => {
         setPressedKeys((keys) => {
            keys.pop()
            return [...keys]
         })
      }, 0)
   }

   const clearPressedKeys = () => setPressedKeys([])

   useEventListener(window, 'keydown', handleKeyDown)
   useEventListener(window, 'keyup', handleKeyUp)

   useEventListener(window, 'blur', clearPressedKeys)
   useEventListener(window, 'focus', clearPressedKeys)

   const undo = () => {
      setHistoryIndex((i) => (i > -1 ? i - 1 : i))
   }
   const redo = () => {
      setHistoryIndex((i) => {
         return i < canvas_path_histories.length - 1 ? i + 1 : i
      })
   }

   useEffect(() => {
      // undo
      if (pressed_keys.length == 2 && pressed_keys[0] == 'Control' && pressed_keys[1] == 'z') {
         undo()
      }

      // redo
      if (
         pressed_keys.length == 3 &&
         pressed_keys[0] == 'Control' &&
         pressed_keys[1] == 'Shift' &&
         pressed_keys[2] == 'Z'
      ) {
         redo()
      }
   }, [pressed_keys])

   useEffect(() => {
      setClonedCanvasPath(() => {
         const arr = canvasPathsRef.current.slice(0, history_index + 1)
         return arr
      })
   }, [history_index])

   useEffect(() => {
      setHistoryIndex(canvas_path_histories.length - 1)
   }, [canvas_path_histories])

   return { clonedCanvasPath }
}

const ALLOWED_KEYS = ['Control', 'Shift', 'z', 'Z']
