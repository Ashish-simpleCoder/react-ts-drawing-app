import { useEffect, useState } from 'react'
import { useEventListener } from './use-event-listener'
import useSyncedRef from './use-synced-ref'

export default function useCanvasHistory<T>({ canvasPaths }: { canvasPaths: T[] }) {
   const [history_index, setHistoryIndex] = useState(canvasPaths.length - 1)
   const [pressed_keys, setPressedKeys] = useState<string[]>([])
   const [clonedCanvasPath, setClonedCanvasPath] = useState(canvasPaths)
   const canvasPathsRef = useSyncedRef(canvasPaths)

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

   useEffect(() => {
      // undo
      if (pressed_keys.length == 2 && pressed_keys[0] == 'Control' && pressed_keys[1] == 'z') {
         setHistoryIndex((i) => (i > -1 ? i - 1 : i))
      }

      // redo
      if (
         pressed_keys.length == 3 &&
         pressed_keys[0] == 'Control' &&
         pressed_keys[1] == 'Shift' &&
         pressed_keys[2] == 'Z'
      ) {
         setHistoryIndex((i) => {
            return i < canvasPaths.length - 1 ? i + 1 : i
         })
      }
   }, [pressed_keys])

   useEffect(() => {
      setClonedCanvasPath(() => {
         const arr = canvasPathsRef.current.slice(0, history_index + 1)
         return arr
      })
   }, [history_index])

   useEffect(() => {
      setHistoryIndex(canvasPaths.length - 1)
   }, [canvasPaths])

   return { clonedCanvasPath }
}

const ALLOWED_KEYS = ['Control', 'Shift', 'z', 'Z']
