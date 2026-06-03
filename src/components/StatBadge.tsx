import { Icon, type IconName } from './Icon';

interface Props {
  icon: IconName;
  label: string;
  value: string;
}

export const StatBadge = ({ icon, label, value }: Props) => {
  return (
    <div className="flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-2 text-sm backdrop-blur ring-1 ring-inset ring-white/15">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 [&>svg]:h-3.5 [&>svg]:w-3.5">
        <Icon name={icon} size={24} color="currentColor" strokeWidth={2} />
      </span>
      <span className="opacity-80">{label}</span>
      <span className="font-display font-bold tabular">{value}</span>
    </div>
  );
};
