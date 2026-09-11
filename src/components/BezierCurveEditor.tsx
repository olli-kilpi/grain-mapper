import { useEffect, useRef, useState } from 'react';
import { BezierPoint } from '../types';

interface BezierCurveEditorProps {
  p1: BezierPoint;
  p2: BezierPoint;
  onChange: (p1: BezierPoint, p2: BezierPoint) => void;
}

export function BezierCurveEditor({ p1, p2, onChange }: BezierCurveEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const p1Ref = useRef(p1);
  const p2Ref = useRef(p2);
  const onChangeRef = useRef(onChange);
  const [draggingPoint, setDraggingPoint] = useState<'p1' | 'p2' | null>(null);

  p1Ref.current = p1;
  p2Ref.current = p2;
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!draggingPoint) return;

    const getSVGPoint = (e: MouseEvent) => {
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
      e.preventDefault();
      const { x, y } = getSVGPoint(e);
      const next = { x: x / 100, y: y / 100 };
      if (draggingPoint === 'p1') {
        onChangeRef.current(next, p2Ref.current);
      } else {
        onChangeRef.current(p1Ref.current, next);
      }
    };

    const handleMouseUp = () => setDraggingPoint(null);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingPoint]);

  const pathData = `M 0,100 C ${p1.x * 100},${p1.y * 100} ${p2.x * 100},${p2.y * 100} 100,0`;

  return (
    <div className="relative aspect-square w-full rounded-md bg-zinc-900 p-2">
      <svg ref={svgRef} viewBox="0 0 100 100" className="h-full w-full cursor-crosshair">
        {[25, 50, 75].map((pos) => (
          <g key={pos}>
            <line x1={pos} y1="0" x2={pos} y2="100" stroke="#52525b" strokeWidth="0.5" />
            <line x1="0" y1={pos} x2="100" y2={pos} stroke="#52525b" strokeWidth="0.5" />
          </g>
        ))}
        <line x1="0" y1="100" x2={p1.x * 100} y2={p1.y * 100} stroke="#71717a" strokeWidth="1" />
        <line x1="100" y1="0" x2={p2.x * 100} y2={p2.y * 100} stroke="#71717a" strokeWidth="1" />
        <path d={pathData} stroke="#10B981" fill="none" strokeWidth="2" />
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
}
