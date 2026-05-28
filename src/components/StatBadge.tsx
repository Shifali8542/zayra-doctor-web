import { Icon, type IconName } from './Icon';

interface Props {
  icon: IconName;
  label: string;
  value: string;
}

export const StatBadge = ({ icon, label, value }: Props) => {
  return (
    <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm gap-2">
      <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
        <Icon name={icon} size={14} color="#FFFFFF" strokeWidth={2} />
      </div>
      <span className="text-[13px] font-normal text-white/70 mr-1">{label}</span>
      <span className="text-[13px] font-bold text-white">{value}</span>
    </div>
  );
};
