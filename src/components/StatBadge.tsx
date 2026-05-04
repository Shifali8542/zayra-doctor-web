import { Icon, type IconName } from './Icon';

interface Props {
  icon: IconName;
  label: string;
  value: string;
}

export const StatBadge = ({ icon, label, value }: Props) => {
  return (
    <div className="flex items-center rounded-pill border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-sm">
      <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
        <Icon name={icon} size={14} color="#FFFFFF" strokeWidth={2} />
      </div>
      <span className="flex-1 text-[15px] font-semibold text-white">{label}</span>
      <span className="mr-4 text-[15px] font-bold text-white">{value}</span>
    </div>
  );
};
