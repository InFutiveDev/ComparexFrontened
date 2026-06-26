import React from 'react';

const ToggleSwitch = ({
  id,
  label,
  isChecked,
  onChange,
  description,
  labelClassName = "font-semibold",
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={isChecked}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2D4CC8]/30 focus:ring-offset-2 ${
            isChecked ? 'bg-[#2D4CC8]' : 'bg-slate-200'
          }`}
          onClick={() => onChange(!isChecked)}
        >
          <span
            className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isChecked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="ml-3 text-sm">
          <span className={`${labelClassName} text-[#13203F]`}>{label}</span>
        </span>
      </div>
      {description && (
        <p className="mt-1.5 pl-14 text-xs leading-relaxed text-slate-500">{description}</p>
      )}
    </div>
  );
};

export default ToggleSwitch;
