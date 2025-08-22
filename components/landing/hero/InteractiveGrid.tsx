"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./HeroGrid.module.css"

const CELL_SIZE = 120 // px
const COLORS = [
  "oklch(0.72 0.2 352.53)", // blue
  "#A764FF",
  "#4B94FD",
  "#FD4B4E",
  "#FF8743",
]

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function SubGrid({ idx }: { idx: number }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [cellColors, setCellColors] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ])
  // Add refs for leave timeouts
  const leaveTimeouts = useRef<(NodeJS.Timeout | null)[]>([
    null,
    null,
    null,
    null,
  ])

  function handleHover(cellIdx: number) {
    setHovered(cellIdx)
    // Clear any pending timeout for this cell
    if (leaveTimeouts.current[cellIdx]) {
      clearTimeout(leaveTimeouts.current[cellIdx]!)
      leaveTimeouts.current[cellIdx] = null
    }
    setCellColors((prev) =>
      prev.map((c, i) => (i === cellIdx ? getRandomColor() : c))
    )
  }
  function handleLeave(cellIdx: number) {
    setHovered(null)
    // Add a small delay before removing the color
    leaveTimeouts.current[cellIdx] = setTimeout(() => {
      setCellColors((prev) => prev.map((c, i) => (i === cellIdx ? null : c)))
      leaveTimeouts.current[cellIdx] = null
    }, 120)
  }
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveTimeouts.current.forEach((t) => t && clearTimeout(t))
    }
  }, [])

  return (
    <div className={styles.subgrid} style={{ pointerEvents: "none" }}>
      {[0, 1, 2, 3].map((cellIdx) => (
        <div
          key={cellIdx}
          className={styles.cell}
          style={{
            background: cellColors[cellIdx] || "transparent",
            pointerEvents: "auto",
          }}
          onMouseEnter={() => handleHover(cellIdx)}
          onMouseLeave={() => handleLeave(cellIdx)}
        />
      ))}
    </div>
  )
}

function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [grid, setGrid] = useState({ columns: 0, rows: 0 })

  useEffect(() => {
    function updateGrid() {
      if (containerRef.current) {
        // Get the container's width minus any padding
        const container = containerRef.current.parentElement;
        const width = container ? container.clientWidth : window.innerWidth;
        const height = containerRef.current.clientHeight;
        
        setDimensions({ width, height })
        setGrid({
          columns: Math.ceil(width / CELL_SIZE),
          rows: Math.ceil(height / CELL_SIZE),
        })
      }
    }
    
    updateGrid()
    window.addEventListener("resize", updateGrid)
    
    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateGrid);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener("resize", updateGrid)
      resizeObserver.disconnect();
    }
  }, [])

  const total = grid.columns * grid.rows

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ width: "100%", height: "100%" }}
    >
      <div
        className={styles.mainGrid}
        style={
          {
            gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
            gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
            "--grid-cell-size": `${CELL_SIZE}px`,
            width: "100%",
            height: "100%",
          } as React.CSSProperties
        }
      >
        {Array.from({ length: total }).map((_, idx) => (
          <SubGrid key={idx} idx={idx} />
        ))}
      </div>
    </div>
  )
}

export default InteractiveGrid