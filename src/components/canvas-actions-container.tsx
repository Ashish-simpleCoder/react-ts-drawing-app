import { useCanvasAtomValue, useCanvasHistoryIndex } from '../atom/canvas.atom'
import { CgRedo, CgUndo } from 'react-icons/cg'

export default function CanvasActionContainer() {
   const { redo, undo, history_cursor } = useCanvasHistoryIndex()
   const { canvas_path_histories } = useCanvasAtomValue()

   return (
      <section className='canvas-action-container fixed bg-gray-500 px-4 py-2'>
         <div className='flex gap-4'>
            <button
               title='Undo -- CtrlZ'
               className={'text-white disabled:text-gray-300 cursor-pointer disabled:cursor-not-allowed'}
               onClick={undo}
               disabled={history_cursor == -1}
            >
               <CgUndo />
            </button>
            <button
               title='Redo -- Ctrl Shift Z'
               className={'text-white disabled:text-gray-300 cursor-pointer disabled:cursor-not-allowed'}
               onClick={redo}
               disabled={history_cursor == canvas_path_histories.length - 1}
            >
               <CgRedo />
            </button>
         </div>
      </section>
   )
}
