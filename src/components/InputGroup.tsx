import React from "react";
import { FieldError } from "react-hook-form";
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
    return (
      <div className="mb-4">
        <div className="md:flex md:items-center">
          <div className="mb-2 md:mb-0 md:w-3/4 md:pr-2">
            <label id={`${name}-label`}>{label}</label>
            {required && (
              <span aria-hidden className="ml-1 font-bold">
                *
              </span>
            )}
            {help && (
              <span
                className="ml-4 font-bold text-gray-400 cursor-pointer"
                title={help}
              >
                ?
              </span>
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
  return (
    <div className="mb-4">
      <div className="md:flex md:items-center">
        <div className="mb-1 md:mb-0 md:w-1/2">
          <label id={`${name}-label`}>{label}</label>
          {help && (
            <span
              className="ml-4 font-bold text-gray-400 cursor-pointer"
              title={help}
            >
              ?
            </span>
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
