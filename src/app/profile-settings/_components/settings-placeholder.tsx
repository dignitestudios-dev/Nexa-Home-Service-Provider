type SettingsPlaceholderProps = {
  title: string;
  description: string;
};

export default function SettingsPlaceholder({ title, description }: SettingsPlaceholderProps) {
  return (
    <div>
      <h2 className="text-[24px] font-[700] leading-[30px] text-black">{title}</h2>
      <div className="mt-6 rounded-[12px] bg-white p-5">
        <p className="text-[16px] leading-7 text-black/80">{description}</p>
      </div>
    </div>
  );
}
