import React from 'react';
import { Canvas } from './ui/components/canvas/canvas.component'

function setupCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
}

function App() {
  return (
    <div>
        <Canvas setupCanvas={setupCanvas} width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
}

export default App;
