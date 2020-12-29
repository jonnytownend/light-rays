import React, { FC, useEffect, useState, createRef } from 'react'

interface CanvasProps {
    setupCanvas: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
    width: number
    height: number
}

export const Canvas: FC<CanvasProps> = ({ setupCanvas, width, height }) => {
    const canvasRef = createRef<HTMLCanvasElement>()

    useEffect(() => {
        const context = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D
        if (!context) {
            return
        }
        setupCanvas(context, width, height)
    }, [])

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    )
}