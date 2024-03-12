import { atom, useAtom, useAtomValue, getDefaultStore } from 'jotai'
import { ElementRef, RefObject } from 'react'

export type CanvasAtom = {
   ref: RefObject<ElementRef<'canvas'>> | { current: null }
   activeClr: keyof typeof CANVAS_CLRS
   opacity: number
   history_cursor: number
   canvas_path_histories: {
      path: [number, number][]
      color: CanvasAtom['activeClr']
      opacity: CanvasAtom['opacity']
   }[]
}
export const CANVAS_CLRS = {
   white: '#fff',
   grey: 'rgb(147, 152, 176)',
   'light violet': 'rgb(229, 153, 247)',
   violet: 'rgb(174, 62, 201)',
   blue: 'rgb(66, 99, 235)',
   'light blue': 'rgb(77, 171, 247)',
   yellow: 'rgb(255, 192, 52)',
   orange: 'rgb(247, 103, 7)',
   green: 'rgb(9, 146, 104)',
   'light green': 'rgb(64, 192, 87)',
   'light red': 'rgb(255, 135, 135)',
   red: 'rgb(224, 49, 49)',
}

export const canvasAtom = atom({
   ref: { current: null },
   activeClr: 'white',
   opacity: 1,
   history_cursor: (() => {
      try {
         const paths = localStorage.getItem('canvas_path_histories')
         if (paths) {
            return JSON.parse(paths).length - 1
         }
      } catch {
         return -1
      }
   })(),
   canvas_path_histories: (() => {
      try {
         const paths = localStorage.getItem('canvas_path_histories')
         if (paths) {
            return JSON.parse(paths)
         }
         return []
      } catch {
         return []
      }
   })(),
} as CanvasAtom)

export const useCanvasAtom = () => useAtom(canvasAtom)
export const useCanvasAtomValue = () => useAtomValue(canvasAtom)
export const useCanvasAtomDispatch = () => useAtom(canvasAtom)[1]

export const useCanvasClrs = () => {
   const { activeClr } = useCanvasAtomValue()
   const canvasDispatch = useCanvasAtomDispatch()

   const updateCanvasClr = (clr: keyof typeof CANVAS_CLRS) => {
      canvasDispatch((atom) => {
         atom.activeClr = clr
         return { ...atom }
      })
   }

   return { activeClr, updateCanvasClr }
}

export const useCanvasHistoryIndex = () => {
   const [{ history_cursor, canvas_path_histories }] = useCanvasAtom()
   const canvasDispatch = useCanvasAtomDispatch()

   const setHistoryIndex = (cb: ((index: number) => number) | number) => {
      canvasDispatch((atom) => {
         if (typeof cb == 'function') {
            atom.history_cursor = cb(atom.history_cursor)
         } else {
            atom.history_cursor = cb as number
         }
         return { ...atom }
      })
   }

   const undo = () => {
      setHistoryIndex((i) => (i > -1 ? i - 1 : i))
   }
   const redo = () => {
      setHistoryIndex((i) => {
         return i < canvas_path_histories.length - 1 ? i + 1 : i
      })
   }

   return { history_cursor, setHistoryIndex, undo, redo }
}

export const getCanvasCtx = () => getDefaultStore().get(canvasAtom).ref.current?.getContext('2d')!
export const getCanvasActiveClr = () => getDefaultStore().get(canvasAtom).activeClr
