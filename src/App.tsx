import React from 'react';
import { Canvas } from './ui/components/canvas/canvas.component'
import Instructions from "./ui/components/instructions/instructions.component";
import { start } from './scene/setup'

function App() {
  return (
    <div>
        <Canvas renderCanvas={start} width={window.innerWidth} height={window.innerHeight} />
        <Instructions />
    </div>
  );
}

export default App;
