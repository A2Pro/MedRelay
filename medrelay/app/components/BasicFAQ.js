import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

const BasicFAQ = () => {
  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h3 className="mb-4 text-center text-3xl font-semibold">
          Frequently Asked Questions
        </h3>
        <Question title="What is MedRelay?">
          <p>
            MedRelay is a real-time data transmission service that connects ambulances with hospitals. It provides crucial patient information to the hospital before the ambulance arrives, enhancing the preparedness and efficiency of medical care.
          </p>
        </Question>
        <Question title="How does MedRelay improve emergency care?">
          <p>
            By transmitting patient data ahead of arrival, MedRelay allows hospitals to prepare for incoming emergencies, allocate resources more effectively, and deliver timely care. This reduces response times and improves patient outcomes.
          </p>
        </Question>
        <Question title="Is MedRelay compatible with existing hospital systems?">
          <p>
            Yes, MedRelay is designed to integrate seamlessly with existing hospital systems, ensuring a smooth flow of information without disrupting current operations. Our team provides support to facilitate easy setup and integration.
          </p>
        </Question>
        <Question title="How secure is the data transmission with MedRelay?">
          <p>
            MedRelay employs MongoDB encryption and security protocols to protect patient data during transmission. We prioritize patient privacy and comply with all relevant regulations to ensure data security.
          </p>
        </Question>
        <Question title="Can MedRelay be used in non-emergency situations?">
          <p>
            Absolutely. MedRelay is also suitable for non-emergency medical transport, ensuring that hospitals receive pertinent patient information ahead of routine or scheduled visits, improving overall care coordination.
          </p>
        </Question>
      </div>
    </div>
  );
};

const Question = ({ title, children, defaultOpen = false }) => {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      className="border-b-[1px] border-b-slate-300"
    >
      <button
        onClick={() => setOpen((pv) => !pv)}
        className="flex w-full items-center justify-between gap-4 py-6"
      >
        <motion.span
          variants={{
            open: {
              color: "rgba(3, 6, 23, 0)",
            },
            closed: {
              color: "rgba(3, 6, 23, 1)",
            },
          }}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-left text-lg font-medium"
        >
          {title}
        </motion.span>
        <motion.span
          variants={{
            open: {
              rotate: "180deg",
              color: "rgb(124 58 237)",
            },
            closed: {
              rotate: "0deg",
              color: "#030617",
            },
          }}
        >
          <FiChevronDown className="text-2xl" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? height : "0px",
          marginBottom: open ? "24px" : "0px",
        }}
        className="overflow-hidden text-slate-600"
      >
        <p ref={ref}>{children}</p>
      </motion.div>
    </motion.div>
  );
};

export default BasicFAQ;
