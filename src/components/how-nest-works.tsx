export function HowNestWorksCard() {
  const steps = [
    "You stake stablecoins into a vault that holds real-world assets.",
    "The vault token you mint represents a claim on underlying assets.",
    "As the assets generate yield, your vault token increases in value.",
  ];
  return (
    <div className="bg-[#F5F5F5] p-8 rounded-[24px]">
      <h2 className="text-[24px] leading-[32px] font-medium">How Nest Works</h2>
      <div className="mt-8 grid grid-cols-3 px-8 gap-12">
        {steps.map((text, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-mono font-semibold text-[14px] leading-[20px] text-[#030301]">
              {idx + 1}
            </div>
            <p className="text-[16px] leading-[24px]">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
