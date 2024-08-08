import React, { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export const CountUpStats = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 md:py-24">
      <h2 className="mb-8 text-center text-base text-indigo-900 sm:text-lg md:mb-16">
        ESTABLISHED TO
        <span className="text-indigo-500"> SERVE THE COMMUNITY</span>
      </h2>

      <div className="flex flex-col items-center justify-center sm:flex-row">
        <Stat
          num={45}
          suffix="%"
          subheading="more lives saved"
        />
        <div className="h-[1px] mr-2 ml-2 w-12 bg-indigo-200 sm:h-12 sm:w-[2px]" />
        <Stat
          num={1}
          decimals={1}
          suffix="K+"
          subheading="hours saved"
        />
        <div className="h-[1px] mr-2 ml-2 w-12 bg-indigo-200 sm:h-12 sm:w-[2px]" />
        <Stat
          num={50}
          suffix="TB+"
          subheading="worth of transcriptions"
        />
        <div className="h-[1px] mr-2 ml-2 w-12 bg-indigo-200 sm:h-12 sm:w-[2px]" />
        <Stat
          num={500}
          suffix="+"
          subheading="hours of operations"
        />
      </div>
    </div>
  );
};

export default CountUpStats;

const Stat = ({ num, suffix, decimals = 0, subheading }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;

    animate(0, num, {
      duration: 2.5,
      onUpdate(value) {
        if (!ref.current) return;

        ref.current.textContent = value.toFixed(decimals);
      },
    });
  }, [num, decimals, isInView]);

  return (
    <div className="flex w-72 flex-col items-center py-8 sm:py-0">
      <p className="mb-2 text-center text-7xl font-semibold sm:text-6xl">
        <span ref={ref}></span>
        {suffix}
      </p>
      <p className="max-w-48 text-center text-neutral-600">{subheading}</p>
    </div>
  );
};