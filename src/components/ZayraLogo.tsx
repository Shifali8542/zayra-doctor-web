/**
 * ZayraLogo
 * Single source of truth for the brand logo.
 * Used in Header, Sidebar, Login, Signup.
 * Pass size="sm" for collapsed sidebar (icon only).
 */

interface Props {
  size?: 'sm' | 'md';
  showWordmark?: boolean;
}

export const ZayraLogo = ({ size = 'md', showWordmark = true }: Props) => {
  const dim = size === 'sm' ? 36 : 36;

  return (
    <div className="flex items-center gap-2">
      <img
        src="/icon.png"
        alt="Zayra logo"
        width={dim}
        height={dim}
        className="rounded-lg object-contain"
        style={{ width: dim, height: dim }}
      />
      {showWordmark && (
        <span className="text-[16px] font-bold tracking-[3px] text-[var(--color-text-primary)]">
          ZAYRA
        </span>
      )}
    </div>
  );
};