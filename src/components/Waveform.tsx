import { useMemo, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/format';

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const buildPlaceholderPath = (
  width: number,
  height: number,
  seed: number,
): string => {
  const rand = seededRandom(seed);
  const baseY = height * 0.5;
  const cycles = 5;
  const cycleW = width / cycles;
  let d = `M 0 ${baseY.toFixed(2)}`;
  for (let i = 0; i < cycles; i++) {
    const cx = i * cycleW;
    const r = (rand() - 0.5) * 4;
    d += ` L ${(cx + cycleW * 0.3).toFixed(2)} ${(baseY + r).toFixed(2)}`;
    d += ` L ${(cx + cycleW * 0.4).toFixed(2)} ${(baseY - height * 0.3).toFixed(2)}`;
    d += ` L ${(cx + cycleW * 0.46).toFixed(2)} ${(baseY + height * 0.18).toFixed(2)}`;
    d += ` L ${(cx + cycleW * 0.6).toFixed(2)} ${baseY.toFixed(2)}`;
    d += ` Q ${(cx + cycleW * 0.72).toFixed(2)} ${(baseY - height * 0.1).toFixed(2)} ${(cx + cycleW * 0.84).toFixed(2)} ${baseY.toFixed(2)}`;
  }
  d += ` L ${width.toFixed(2)} ${baseY.toFixed(2)}`;
  return d;
};

interface WaveformPlaceholderProps {
  height?: number;
  className?: string;
  seed?: number;
}

export const WaveformPlaceholder = ({
  height = 56,
  className,
  seed = 5,
}: WaveformPlaceholderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (ref.current) setWidth(ref.current.clientWidth);
    };
    measure();
    const obs = new ResizeObserver(measure);
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-md bg-[var(--color-bg-alt)] w-full',
        className,
      )}
      style={{ height }}
    >
      {width > 0 ? (
        <svg width={width} height={height}>
          <path
            d={buildPlaceholderPath(width, height, seed)}
            stroke="var(--color-divider)"
            strokeWidth={1.4}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </div>
  );
};

// =============================================================================
// EcgWaveform - dark navy background ECG strip
// =============================================================================

type WaveSeverity = 'normal' | 'urgent' | 'critical';

interface EcgWaveformProps {
  height?: number;
  seed?: number;
  severity?: WaveSeverity;
  cycles?: number;
  className?: string;
  showGrid?: boolean;
  width?: number;
}

interface BeatParams {
  amplitude: number;
  pWave: number;
  width: number;
  qrsWidth: number;
  jitter: number;
}

const severityToParams = (sev: WaveSeverity): BeatParams => {
  switch (sev) {
    case 'critical':
      return { amplitude: 0.95, pWave: 0.0, width: 1.0, qrsWidth: 1.6, jitter: 0.18 };
    case 'urgent':
      return { amplitude: 0.7, pWave: 0.05, width: 0.8, qrsWidth: 1.0, jitter: 0.1 };
    default:
      return { amplitude: 0.6, pWave: 0.18, width: 1.0, qrsWidth: 0.7, jitter: 0.04 };
  }
};

const generateEcgPath = (
  width: number,
  height: number,
  cycles: number,
  seed: number,
  severity: WaveSeverity,
): string => {
  const rand = seededRandom(seed);
  const params = severityToParams(severity);
  const baseY = height * 0.55;
  const ampMax = height * 0.4 * params.amplitude;
  const cycleW = width / cycles;
  let d = `M 0 ${baseY.toFixed(2)}`;

  for (let i = 0; i < cycles; i++) {
    const cx = i * cycleW;
    const j = (rand() - 0.5) * params.jitter * height;
    d += ` L ${(cx + cycleW * 0.05).toFixed(2)} ${(baseY + j).toFixed(2)}`;
    if (params.pWave > 0) {
      const pcx = cx + cycleW * 0.15;
      const py = baseY - height * 0.08 * params.pWave;
      d += ` Q ${pcx.toFixed(2)} ${py.toFixed(2)} ${(cx + cycleW * 0.22).toFixed(2)} ${baseY.toFixed(2)}`;
    }
    d += ` L ${(cx + cycleW * 0.32).toFixed(2)} ${baseY.toFixed(2)}`;
    const qX = cx + cycleW * 0.36;
    const qY = baseY + ampMax * 0.15;
    d += ` L ${qX.toFixed(2)} ${qY.toFixed(2)}`;
    const rX = cx + cycleW * (0.4 + 0.02 * params.qrsWidth);
    const rY = baseY - ampMax;
    d += ` L ${rX.toFixed(2)} ${rY.toFixed(2)}`;
    const sX = cx + cycleW * (0.46 + 0.04 * params.qrsWidth);
    const sY = baseY + ampMax * 0.35;
    d += ` L ${sX.toFixed(2)} ${sY.toFixed(2)}`;
    d += ` L ${(cx + cycleW * 0.6).toFixed(2)} ${baseY.toFixed(2)}`;
    const tcx = cx + cycleW * 0.72;
    const ty = baseY - height * 0.12;
    d += ` Q ${tcx.toFixed(2)} ${ty.toFixed(2)} ${(cx + cycleW * 0.84).toFixed(2)} ${baseY.toFixed(2)}`;
    d += ` L ${(cx + cycleW * 0.98).toFixed(2)} ${baseY.toFixed(2)}`;
  }
  d += ` L ${width.toFixed(2)} ${baseY.toFixed(2)}`;
  return d;
};

export const EcgWaveform = ({
  height = 130,
  seed = 7,
  severity = 'normal',
  cycles,
  className,
  showGrid = true,
  width: fixedWidth,
}: EcgWaveformProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(fixedWidth ?? 0);

  useEffect(() => {
    if (fixedWidth) {
      setMeasuredWidth(fixedWidth);
      return;
    }
    const measure = () => {
      if (ref.current) setMeasuredWidth(ref.current.clientWidth);
    };
    measure();
    const obs = new ResizeObserver(measure);
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [fixedWidth]);

  const width = measuredWidth;
  const beatCount =
    cycles ?? (severity === 'critical' ? 6 : severity === 'urgent' ? 5 : 4);

  const path = useMemo(() => {
    if (!width) return '';
    return generateEcgPath(width, height, beatCount, seed, severity);
  }, [width, height, beatCount, seed, severity]);

  const gridLines = useMemo(() => {
    if (!showGrid || !width) return null;
    const lines: React.ReactElement[] = [];
    const step = 16;
    for (let x = 0; x <= width; x += step) {
      lines.push(
        <line key={`vx-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />,
      );
    }
    for (let y = 0; y <= height; y += step) {
      lines.push(
        <line key={`hy-${y}`} x1={0} y1={y} x2={width} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />,
      );
    }
    return <g>{lines}</g>;
  }, [showGrid, width, height]);

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden rounded-lg', className)}
      style={{ height, backgroundColor: '#0E1B2C' }}
    >
      {width > 0 ? (
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill="#0E1B2C" />
          {gridLines}
          <path
            d={path}
            stroke="#E0F4F0"
            strokeWidth={1.6}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </div>
  );
};
