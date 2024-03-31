const BoxClick = ({ leftClicks, leftDoubleClicks, text }: { leftClicks: number; leftDoubleClicks: number; text: string }) => {
  return (
    <div className="border border-[#e0e0e0] rounded-md p-4">
      <h1 className="text-4xl font-bold text-center">{text}</h1>
      <h3 className="text-2xl font-semibold text-center mt-3">Clicks: {leftClicks}</h3>
      <h3 className="text-2xl font-semibold text-center mt-3">
        Double: <span className="text-red-500">{leftDoubleClicks}</span>
      </h3>
    </div>
  );
};

export default BoxClick;
