import { FaRedo, FaUndo } from "react-icons/fa";

export default function CanvasActionContainer(){
    return (
        <section className="canvas-action-container fixed bg-gray-500 px-4 py-2">
            <div className="flex gap-4">

            <button title="Undo -- CtrlZ" className={'text-white'}>
                <FaUndo />
            </button>
            <button title="Redo -- Ctrl Shift Z" className={'text-white'}>
                <FaRedo />
            </button>
            </div>
        </section>
    )
}