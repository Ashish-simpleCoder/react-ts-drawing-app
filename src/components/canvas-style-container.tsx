import { For } from 'classic-react-components'
import { CANVAS_CLRS, useCanvasAtom, useCanvasClrs } from '../atom/canvas.atom'

export default function CanvasStyleContainer() {
   return (
      <div className='fixed rounded-lg bg-[#232529] right-1 top-1'>
         <CanvasColors />
         <CanvasOpacity />
      </div>
   )
}

function CanvasColors() {
   const { activeClr, updateCanvasClr } = useCanvasClrs()

   return (
      <div className='grid grid-cols-4 gap-1 p-1'>
         <For data={Object.keys(CANVAS_CLRS) as Array<keyof typeof CANVAS_CLRS>}>
            {(clr) => {
               return (
                  <button
                     key={clr}
                     onClick={() => updateCanvasClr(clr)}
                     className={`p-2 hover:bg-[#2e3034] rounded-md flex justify-center ${activeClr == clr ? 'bg-[#36383c]' : ''}`}
                     title={clr}
                  >
                     <div style={{ background: CANVAS_CLRS[clr] }} className='w-4 h-4 rounded-full'></div>
                  </button>
               )
            }}
         </For>
      </div>
   )
}

function CanvasOpacity() {
   const [{ opacity }, setCanvas] = useCanvasAtom()

   return (
      <div className='p-1'>
         <input
            type='range'
            step={0.1}
            max={1}
            min={0}
            value={opacity}
            onChange={(e) =>
               setCanvas((state) => {
                  state.opacity = +e.target.value
                  return { ...state }
               })
            }
         />
      </div>
   )
}
