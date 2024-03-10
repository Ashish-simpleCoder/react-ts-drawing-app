import Canvas from './components/canvas'
import CanvasActionContainer from './components/canvas-actions-container'
import CanvasStyleContainer from './components/canvas-style-container'

export default function App() {
   return (
      <div>
         <CanvasActionContainer />
         <Canvas />
         <CanvasStyleContainer />
      </div>
   )
}
