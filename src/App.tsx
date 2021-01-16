import React from 'react';
import { Canvas } from './ui/components/canvas/canvas.component'
import { start } from './scene/setup'

function App() {
  return (
    <div>
        <Canvas renderCanvas={start} width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
}

export default App;
