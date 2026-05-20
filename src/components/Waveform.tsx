import { useEffect, useRef, useState, useMemo } from 'react';
import { cn } from '@/utils/format';

// =============================================================================
// WaveformPlaceholder — lightweight skeleton shown while real data loads
// =============================================================================

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

// =============================================================================
// RealEcgWaveform — renders actual sample data from the backend
// =============================================================================

interface RealEcgWaveformProps {
  /** Raw amplitude samples from the backend (mV values). */
  samples: number[];
  /** Effective sampling rate in Hz (from backend, e.g. 125 after downsample). */
  effectiveSamplingRate?: number;
  /** How many seconds of signal to display. Defaults to all. */
  displaySeconds?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  strokeColor?: string;
  /** Minimum pixel width of the SVG (enables horizontal scroll). */
  minWidth?: number;
}

/**
 * Converts a window of amplitude samples into an SVG polyline points string.
 * Normalises amplitude to fit the SVG height with 10% vertical padding.
 */
function samplesToPath(
  samples: number[],
  svgWidth: number,
  svgHeight: number,
): string {
  if (samples.length === 0) return '';

  const padding = svgHeight * 0.1;
  const drawH = svgHeight - padding * 2;

  let min = samples[0];
  let max = samples[0];
  for (const s of samples) {
    if (s < min) min = s;
    if (s > max) max = s;
  }

  const range = max - min || 1;
  const xStep = svgWidth / (samples.length - 1 || 1);

  const points = samples.map((s, i) => {
    const x = i * xStep;
    // Invert: high amplitude → top of SVG
    const y = padding + drawH - ((s - min) / range) * drawH;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return points.join(' ');
}

export const RealEcgWaveform = ({
  samples,
  effectiveSamplingRate = 125,
  displaySeconds,
  height = 130,
  className,
  showGrid = true,
  strokeColor = '#E0F4F0',
  minWidth,
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

  // Slice to displaySeconds if provided
  const visibleSamples = useMemo(() => {
    if (!displaySeconds) return samples;
    const maxSamples = Math.round(effectiveSamplingRate * displaySeconds);
    return samples.slice(0, maxSamples);
  }, [samples, displaySeconds, effectiveSamplingRate]);

  const width = Math.max(containerWidth, minWidth ?? 0);

  const points = useMemo(() => {
    if (!width || visibleSamples.length === 0) return '';
    return samplesToPath(visibleSamples, width, height);
  }, [visibleSamples, width, height]);

  const gridLines = useMemo(() => {
    if (!showGrid || !width) return null;
    const lines: React.ReactElement[] = [];
    const step = 16;
    for (let x = 0; x <= width; x += step) {
      lines.push(
        <line
          key={`vx-${x}`}
          x1={x} y1={0} x2={x} y2={height}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />,
      );
    }
    for (let y = 0; y <= height; y += step) {
      lines.push(
        <line
          key={`hy-${y}`}
          x1={0} y1={y} x2={width} y2={y}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />,
      );
    }
    return <g>{lines}</g>;
  }, [showGrid, width, height]);

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden rounded-lg', className)}
      style={{ height, backgroundColor: '#0E1B2C', minWidth: minWidth }}
    >
      {containerWidth > 0 && visibleSamples.length > 0 ? (
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill="#0E1B2C" />
          {gridLines}
          <polyline
            points={points}
            stroke={strokeColor}
            strokeWidth={1.6}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <div className="h-full w-full animate-pulse bg-[#0E1B2C]" />
      )}
    </div>
  );
};