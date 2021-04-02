import React from "react";
import { FieldError } from "react-hook-form";
import { usePopperTooltip } from "react-popper-tooltip";

import { useSiteData } from "~/lib/site-data";

import { mwxxs } from "~/styles/headings";

export const NumberGroup = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    placeholder?: string;
    prefix?: string;
    required?: boolean;
    label: string;
    help?: string;
    errors?: FieldError;
    errorText: string;
  }
>(
  (
    { name, placeholder, prefix, required, label, help, errors, errorText },
    ref
  ) => {
    const { t } = useSiteData();

    const {
      getArrowProps,
      getTooltipProps,
      setTooltipRef,
      setTriggerRef,
      visible,
    } = usePopperTooltip({
      trigger: "click",
    });

    return (
      <div className="mb-4">
        <div className="md:flex md:items-center">
          <div className="mb-2 md:mb-0 md:w-3/4 md:pr-2 flex items-center">
            <div>
              <label id={`${name}-label`}>{label}</label>
              {required && (
                <span
                  aria-hidden
                  className="ml-1 font-bold"
                  title={t("required")}
                >
                  *
                </span>
              )}
            </div>
            {help && (
              <>
                <button
                  className="ml-4 transition-colors text-indigo-700 hover:text-indigo-800 focus:text-indigo-900 focus:outline-none"
                  type="button"
                  ref={setTriggerRef}
                >
                  <svg
                    className="fill-current"
                    height={24}
                    width={24}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                  </svg>
                </button>
                {visible && (
                  <div
                    ref={setTooltipRef}
                    {...getTooltipProps({
                      className: "tooltip-container max-w-md p-3",
                    })}
                  >
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                    {help}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={`${mwxxs} ml-auto md:ml-0 md:w-1/4`}>
            <div className="relative text-gray-700">
              <input
                className={`w-full rounded-lg ${prefix ? "pl-8" : ""} ${
                  errors ? "border-red-700" : ""
                }`}
                name={name}
                type="number"
                placeholder={placeholder}
                aria-labelledby={`${name}-label`}
                aria-describedby={`${name}-error`}
                ref={ref}
              />
              {prefix && (
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
                  {prefix}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:flex md:justify-end">
          <div className={`${mwxxs} ml-auto md:ml-0 md:w-1/4`}>
            {errors && (
              <span className="text-xs text-red-700" id={`${name}-error`}>
                {errorText}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);
NumberGroup.displayName = "InputGroup";

export const SelectGroup = React.forwardRef<
  HTMLSelectElement,
  {
    name: string;
    options: [string, string | number][];
    label: string;
    help: string;
    errors?: FieldError;
    errorText: string;
  }
>(({ name, options, label, help, errors, errorText }, ref) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: "click",
  });

  return (
    <div className="mb-4">
      <div className="md:flex md:items-center">
        <div className="mb-2 md:mb-0 md:w-1/2 md:pr-2 flex items-center">
          <label id={`${name}-label`}>{label}</label>
          {help && (
            <>
              <button
                className="ml-4 transition-colors text-indigo-700 hover:text-indigo-800 focus:text-indigo-900 focus:outline-none"
                type="button"
                ref={setTriggerRef}
              >
                <svg
                  className="fill-current"
                  height={24}
                  width={24}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
              </button>
              {visible && (
                <div
                  ref={setTooltipRef}
                  {...getTooltipProps({
                    className: "tooltip-container max-w-md p-3",
                  })}
                >
                  <div {...getArrowProps({ className: "tooltip-arrow" })} />
                  {help}
                </div>
              )}
            </>
          )}
        </div>
        <div className="md:w-1/2 md:flex-grow">
          <div className="relative text-gray-700">
            <select
              className={`w-full rounded-lg ${errors ? "border-red-700" : ""}`}
              name={name}
              aria-labelledby={`${name}-label`}
              aria-describedby={`${name}-error`}
              ref={ref}
            >
              {options.map(([text, val]) => (
                <option value={val} key={text}>
                  {text}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="md:flex md:justify-end">
        <div className="md:w-1/2">
          {errors && (
            <span className="text-xs text-red-700" id={`${name}-error`}>
              {errorText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
SelectGroup.displayName = "SelectGroup";
