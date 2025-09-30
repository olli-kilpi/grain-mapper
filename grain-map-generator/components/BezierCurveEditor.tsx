
import React, { useState, useRef, useEffect } from 'react';
import { bezierPoint } from '../types';

interface BezierCurveEditorProps {
  p1: bezierPoint;
  p2: bezierPoint;
  onChange: (p1: bezierPoint, p2: bezierPoint) => void;
}

export const BezierCurveEditor: React.FC<BezierCurveEditorProps> = ({ p1, p2, onChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingPoint, setDraggingPoint] = useState<'p1' | 'p2' | null>(null);

  const getSVGPoint = (e: MouseEvent | React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPoint = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    return {
      x: Math.max(0, Math.min(100, svgPoint.x)),
      y: Math.max(0, Math.min(100, svgPoint.y)),
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingPoint) return;
    e.preventDefault();
    const { x, y } = getSVGPoint(e);
    const newPoint = { x: x / 100, y: y / 100 };
    if (draggingPoint === 'p1') {
      onChange(newPoint, p2);
    } else {
      onChange(p1, newPoint);
    }
  };

  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  useEffect(() => {
    if(draggingPoint) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingPoint]);

  const pathData = `M 0,100 C ${p1.x * 100},${p1.y * 100} ${p2.x * 100},${p2.y * 100} 100,0`;

  return (
    <div className="w-full aspect-square bg-zinc-900 rounded-md p-2 relative">
      <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full cursor-crosshair">
        {/* Grid lines */}
        {[25, 50, 75].map(pos => (
          <React.Fragment key={pos}>
            <line x1={pos} y1="0" x2={pos} y2="100" stroke="#52525b" strokeWidth="0.5" />
            <line x1="0" y1={pos} x2="100" y2={pos} stroke="#52525b" strokeWidth="0.5" />
          </React.Fragment>
        ))}
        
        {/* Control lines */}
        <line x1="0" y1="100" x2={p1.x * 100} y2={p1.y * 100} stroke="#71717a" strokeWidth="1" />
        <line x1="100" y1="0" x2={p2.x * 100} y2={p2.y * 100} stroke="#71717a" strokeWidth="1" />

        {/* Bezier curve */}
        <path d={pathData} stroke="#10B981" fill="none" strokeWidth="2" />
        
        {/* Control points */}
        <circle
          cx={p1.x * 100}
          cy={p1.y * 100}
          r="4"
          fill="white"
          stroke="#10B981"
          strokeWidth="2"
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={() => setDraggingPoint('p1')}
        />
        <circle
          cx={p2.x * 100}
          cy={p2.y * 100}
          r="4"
          fill="white"
          stroke="#10B981"
          strokeWidth="2"
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={() => setDraggingPoint('p2')}
        />
      </svg>
    </div>
  );
};
