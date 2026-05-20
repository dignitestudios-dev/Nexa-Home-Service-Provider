type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type SettingsLegalPageProps = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export default function SettingsLegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: SettingsLegalPageProps) {
  return (
    <div className="w-full max-w-[766px]">
      <h2 className="text-[24px] font-[700] leading-[30px] text-black">{title}</h2>
      <p className="mt-2 text-[14px] leading-5 text-[rgba(24,24,24,0.6)]">
        Last updated: {lastUpdated}
      </p>

      <div className="mt-6 space-y-4">
        <article className="rounded-[12px] bg-white p-5 md:p-6">
          <p className="text-[16px] leading-7 text-[#565656]">{intro}</p>
        </article>

        {sections.map((section) => (
          <article
            key={section.heading}
            className="rounded-[12px] bg-white p-5 md:p-6"
          >
            <h3 className="text-[18px] font-[600] leading-6 text-[#181818]">
              {section.heading}
            </h3>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-[16px] leading-7 text-[#565656]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
