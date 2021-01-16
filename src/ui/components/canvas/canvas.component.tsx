import React, { FC, useEffect, useState, createRef } from 'react'

interface CanvasProps {
    renderCanvas: (canvas: HTMLCanvasElement, width: number, height: number) => void
    width: number
    height: number
}

export const Canvas: FC<CanvasProps> = ({ renderCanvas, width, height }) => {
    const canvasRef = createRef<HTMLCanvasElement>()

    useEffect(() => {
        if (!canvasRef.current) {
            return
        }
        renderCanvas(canvasRef.current, width, height)
    }, [])

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    )
}