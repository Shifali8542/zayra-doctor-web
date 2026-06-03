interface Props {
  size?: 'sm' | 'md';
  showWordmark?: boolean;
}

export const ZayraLogo = ({ size = 'md', showWordmark = true }: Props) => {
  const dim = size === 'sm' ? 60 : 60;

  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/icon.png"
        alt="Zayra logo"
        width={dim}
        height={dim}
        className="rounded-lg object-contain"
        style={{ width: dim, height: dim }}
      />
      {showWordmark && (
        <span 
          className="font-display text-[1.05rem] font-bold tracking-[0.18em] text-foreground"
          style={{ fontFeatureSettings: '"ss01"' }}
        >
          ZAYRA
        </span>
      )}
    </div>
  );
};