import React from "react";
import { Control, FieldError, RegisterOptions } from "react-hook-form";

import { HelpPopup } from "~/components/HelpPopup";
import { useSiteData } from "~/lib/site-data";

import { mwxxs } from "~/styles/headings";
import { NumberInput } from "./NumberInput";

export const NumberGroup = ({
  label,
  name,
  control,
  integer,
  rules,
  placeholder,
  prefix,
  required,
  help,
  errors,
  errorText,
}: {
  label: string;
  name: string;
  control: Control<Record<string, any>>;
  integer?: boolean;
  rules?: RegisterOptions;
  placeholder?: string;
  prefix?: string;
  required?: boolean;
  help?: string;
  errors?: FieldError;
  errorText: string;
}) => {
  const { t } = useSiteData();

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
          {help && <HelpPopup>{help}</HelpPopup>}
        </div>
        <div className={`${mwxxs} ml-auto md:ml-0 md:w-1/4`}>
          <NumberInput
            name={name}
            control={control}
            integer={integer}
            rules={rules}
            placeholder={placeholder}
            prefix={prefix}
          />
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
};

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
        <div className="mb-2 md:mb-0 md:w-1/2 md:pr-2 flex items-center">
          <label id={`${name}-label`}>{label}</label>
          {help && <HelpPopup>{help}</HelpPopup>}
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
