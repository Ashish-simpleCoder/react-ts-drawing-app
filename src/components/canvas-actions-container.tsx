import { FaRedo, FaUndo } from 'react-icons/fa'
import { useCanvasAtomValue, useCanvasHistoryIndex } from '../atom/canvas.atom'

export default function CanvasActionContainer() {
   const { redo, undo, history_index } = useCanvasHistoryIndex()
   const { canvas_path_histories } = useCanvasAtomValue()

   return (
      <section className='canvas-action-container fixed bg-gray-500 px-4 py-2'>
         <div className='flex gap-4'>
            <button
               title='Undo -- CtrlZ'
               className={'text-white disabled:text-gray-300 cursor-pointer disabled:cursor-not-allowed'}
               onClick={undo}
               disabled={history_index == -1}
            >
               <FaUndo />
            </button>
            <button
               title='Redo -- Ctrl Shift Z'
               className={'text-white disabled:text-gray-300 cursor-pointer disabled:cursor-not-allowed'}
               onClick={redo}
               disabled={history_index == canvas_path_histories.length - 1}
            >
               <FaRedo />
            </button>
         </div>
      </section>
   )
}
