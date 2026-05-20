import { useEffect, useRef, useState, useMemo } from 'react';
import { cn } from '@/utils/format';
import type { WaveformGrid } from '@/types';

interface WaveformPlaceholderProps {
  height?: number;
  className?: string;
}

export const WaveformPlaceholder = ({
  height = 56,
  className,
}: WaveformPlaceholderProps) => (
  <div
    className={cn(
      'animate-pulse overflow-hidden rounded-md bg-[var(--color-bg-alt)] w-full',
      className,
    )}
    style={{ height }}
  />
);

interface GridConfig {
  smallBoxMs: number;
  largeBoxMs: number;
  smallBoxMv: number;
  largeBoxMv: number;
  pxPerMs: number;
  pxPerMv: number;
  svgWidth: number;
  svgHeight: number;
}

function buildClinicalGrid(cfg: GridConfig): React.ReactElement {
  const lines: React.ReactElement[] = [];
  const smallStepX = cfg.pxPerMs * cfg.smallBoxMs;
  const largeStepX = cfg.pxPerMs * cfg.largeBoxMs;

  if (smallStepX > 2) {
    let x = 0;
    let idx = 0;
    while (x <= cfg.svgWidth + 0.5) {
      const isLarge = Math.abs(x % largeStepX) < 0.5 || Math.abs((x % largeStepX) - largeStepX) < 0.5;
      lines.push(
        <line
          key={`vx-${idx}`}
          x1={x} y1={0} x2={x} y2={cfg.svgHeight}
          stroke={isLarge ? 'rgba(255,100,100,0.18)' : 'rgba(255,100,100,0.07)'}
          strokeWidth={isLarge ? 0.7 : 0.4}
        />,
      );
      x += smallStepX;
      idx++;
    }
  }

  const smallStepY = cfg.pxPerMv * cfg.smallBoxMv;
  const largeStepY = cfg.pxPerMv * cfg.largeBoxMv;

  if (smallStepY > 2) {
    let y = 0;
    let idx = 0;
    while (y <= cfg.svgHeight + 0.5) {
      const isLarge = Math.abs(y % largeStepY) < 0.5 || Math.abs((y % largeStepY) - largeStepY) < 0.5;
      lines.push(
        <line
          key={`hy-${idx}`}
          x1={0} y1={y} x2={cfg.svgWidth} y2={y}
          stroke={isLarge ? 'rgba(255,100,100,0.18)' : 'rgba(255,100,100,0.07)'}
          strokeWidth={isLarge ? 0.7 : 0.4}
        />,
      );
      y += smallStepY;
      idx++;
    }
  }

  return <g>{lines}</g>;
}

function samplesToPath(
  samples: number[],
  svgWidth: number,
  svgHeight: number,
  pxPerMv: number,
): string {
  if (samples.length === 0) return '';
  const sorted = [...samples].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const halfRange = svgHeight / (2 * pxPerMv);
  const minVal = median - halfRange;
  const xStep = svgWidth / (samples.length - 1 || 1);
  const points = samples.map((s, i) => {
    const x = i * xStep;
    const y = svgHeight - ((s - minVal) * pxPerMv);
    const yc = Math.max(0, Math.min(svgHeight, y));
    return `${x.toFixed(2)},${yc.toFixed(2)}`;
  });
  return points.join(' ');
}

interface RealEcgWaveformProps {
  samples: number[];
  effectiveSamplingRate?: number;
  displaySeconds?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  minWidth?: number;
  grid?: WaveformGrid;
}

export const RealEcgWaveform = ({
  samples,
  effectiveSamplingRate = 125,
  displaySeconds,
  height = 130,
  className,
  strokeColor = '#4EECD8',
  minWidth,
  grid,
}: RealEcgWaveformProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (ref.current) setContainerWidth(ref.current.clientWidth);
    };
    measure();
    const obs = new ResizeObserver(measure);
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const visibleSamples = useMemo(() => {
    if (!displaySeconds) return samples;
    const maxSamples = Math.round(effectiveSamplingRate * displaySeconds);
    return samples.slice(0, maxSamples);
  }, [samples, displaySeconds, effectiveSamplingRate]);

  const svgWidth = Math.max(containerWidth, minWidth ?? 0);
  const durationMs = (visibleSamples.length / effectiveSamplingRate) * 1000;
  const pxPerMs = svgWidth > 0 && durationMs > 0 ? svgWidth / durationMs : 0;
  const pxPerMv = height / 3;

  const gridEl = useMemo(() => {
    if (!svgWidth || !pxPerMs) return null;
    if (grid) {
      return buildClinicalGrid({
        smallBoxMs: grid.small_box_ms,
        largeBoxMs: grid.large_box_ms,
        smallBoxMv: grid.small_box_mv,
        largeBoxMv: grid.large_box_mv,
        pxPerMs,
        pxPerMv,
        svgWidth,
        svgHeight: height,
      });
    }
    const lines: React.ReactElement[] = [];
    const step = 16;
    for (let x = 0; x <= svgWidth; x += step) {
      lines.push(<line key={`vx-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />);
    }
    for (let y = 0; y <= height; y += step) {
      lines.push(<line key={`hy-${y}`} x1={0} y1={y} x2={svgWidth} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />);
    }
    return <g>{lines}</g>;
  }, [grid, svgWidth, height, pxPerMs, pxPerMv]);

  const points = useMemo(() => {
    if (!svgWidth || visibleSamples.length === 0) return '';
    return samplesToPath(visibleSamples, svgWidth, height, pxPerMv);
  }, [visibleSamples, svgWidth, height, pxPerMv]);

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden rounded-lg', className)}
      style={{ height, backgroundColor: '#0A1628', minWidth }}
    >
      {containerWidth > 0 && visibleSamples.length > 0 ? (
        <svg width={svgWidth} height={height}>
          <rect x={0} y={0} width={svgWidth} height={height} fill="#0A1628" />
          {gridEl}
          <polyline
            points={points}
            stroke={strokeColor}
            strokeWidth={1.5}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <div className="h-full w-full animate-pulse bg-[#0A1628]" />
      )}
    </div>
  );
};