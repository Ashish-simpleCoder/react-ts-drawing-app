import { atom, useAtom, useAtomValue, getDefaultStore } from 'jotai'
import { ElementRef, RefObject } from 'react'

export type CanvasAtom = {
   ref: RefObject<ElementRef<'canvas'>> | { current: null }
   activeClr: keyof typeof CANVAS_CLRS
   opacity: number
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
} as CanvasAtom)

export const useCanvasAtom = () => useAtom(canvasAtom)
export const useCanvasAtomValue = () => useAtomValue(canvasAtom)
export const useCanvasClrs = () => {
   const [{ activeClr }, setCanvas] = useCanvasAtom()

   const updateCanvasClr = (clr: keyof typeof CANVAS_CLRS) => {
      setCanvas((s) => {
         s.activeClr = clr
         return { ...s }
      })
   }

   return { activeClr, updateCanvasClr }
}
export const getCanvasCtx = () => getDefaultStore().get(canvasAtom).ref.current?.getContext('2d')!
