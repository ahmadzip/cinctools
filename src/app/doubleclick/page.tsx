'use client';
import { useEffect, useState } from 'react';
import BoxClick from './_component/BoxClick';
import { toast } from 'react-toastify';
import RuningText from '@/component/RunningText';

const DoubleClickPage = () => {
  const [leftClicks, setLeftClicks] = useState(0);
  const [leftDoubleClicks, setLeftDoubleClicks] = useState(0);
  const [middleClicks, setMiddleClicks] = useState(0);
  const [middleDoubleClicks, setMiddleDoubleClicks] = useState(0);
  const [rightClicks, setRightClicks] = useState(0);
  const [rightDoubleClicks, setRightDoubleClicks] = useState(0);
  const [timedouble, setTimedouble] = useState(80);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [timeclick, setTimeclick] = useState(0);
  const [lastClickButton, setLastClickButton] = useState(0);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const doubleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log('Current double click time threshold:', timedouble);
    event.preventDefault();
    const clickTime = performance.now();
    setLastClickTime(clickTime);

    const diff = clickTime - lastClickTime;
    const button = event.button;

    const isLeftClick = button === 0;
    const isMiddleClick = button === 1;
    const isRightClick = button === 2;

    const isDoubleClick = diff < timedouble && lastClickButton === button;

    setTimeclick(diff.toFixed(2) as unknown as number);

    switch (button) {
      case 0:
        setLeftClicks(leftClicks + 1);
        if (isDoubleClick && isLeftClick) {
          setLeftDoubleClicks(leftDoubleClicks + 1);
          toast.warn('Left click double click detected!');
        }
        break;
      case 1:
        setMiddleClicks(middleClicks + 1);
        if (isDoubleClick && isMiddleClick) {
          setMiddleDoubleClicks(middleDoubleClicks + 1);
          toast.warn('Middle click double click detected!');
        }
        break;
      case 2:
        setRightClicks(rightClicks + 1);
        if (isDoubleClick && isRightClick) {
          setRightDoubleClicks(rightDoubleClicks + 1);
          toast.warn('Right click double click detected!');
        }
        break;
      default:
        break;
    }

    setLastClickButton(button);
  };

  const reset = () => {
    setLeftClicks(0);
    setLeftDoubleClicks(0);
    setMiddleClicks(0);
    setMiddleDoubleClicks(0);
    setRightClicks(0);
    setRightDoubleClicks(0);
    setLastClickTime(0);
    setTimeclick(0);
    setTimedouble(80);
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[1050px] bg-white py-6 px-9 dark:bg-[#27292C] rounded-md shadow-for duration-200">
        <div className="mb-6 pt-4">
          <RuningText text="Double Click Detector" />
          <button className="hover:shadow-form w-full rounded-md bg-[#774FE9] py-10 px-8 text-center text-xl font-semibold text-white outline-none" onMouseDown={doubleClick} contextMenu={'false'}>
            Click me!
          </button>
          <p className="text-center text-xl font-semibold mt-5">Time between clicks: {timeclick}ms</p>
          <div className="grid grid-cols-3 gap-4 mt-8 text-center">
            <BoxClick leftClicks={leftClicks} leftDoubleClicks={leftDoubleClicks} text="Left" />
            <BoxClick leftClicks={middleClicks} leftDoubleClicks={middleDoubleClicks} text="Middle" />
            <BoxClick leftClicks={rightClicks} leftDoubleClicks={rightDoubleClicks} text="Right" />
          </div>
          <div className="mt-8">
            <label className="block text-xl font-semibold text-center mt-5">Double Click Time</label>
            <input
              type="range"
              min="0"
              max="200"
              className="w-full mt-5"
              value={timedouble}
              onChange={(e) => {
                setTimedouble(parseInt(e.target.value));
                console.log('timedouble changed:', e.target.value);
              }}
            />
            <p className="text-center text-xl font-semibold mt-5">Time: {timedouble}ms</p>
          </div>
          <button onClick={reset} className="hover:shadow-form w-full rounded-md bg-[#E0E1E6] py-3 px-8 text-center text-base font-semibold text-black outline-none mt-8">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoubleClickPage;
