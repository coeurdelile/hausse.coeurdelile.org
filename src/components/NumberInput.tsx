import React, { useLayoutEffect, useEffect } from "react";
import {
  Control,
  Controller,
  FieldError,
  RegisterOptions,
} from "react-hook-form";
import { useSiteData } from "~/lib/site-data";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useRunAfterUpdate() {
  const afterPaintRef = React.useRef<(() => void) | null>(null);
  useIsomorphicLayoutEffect(() => {
    if (afterPaintRef.current) {
      afterPaintRef.current();
      afterPaintRef.current = null;
    }
  });
  const runAfterUpdate = (fn: () => void) => (afterPaintRef.current = fn);
  return runAfterUpdate;
}

const formatPreservingCursor = (
  text: string,
  cursor: number
): [string, number] => {
  const beforeCursor = text.slice(0, cursor);
  const afterCursor = text.slice(cursor, text.length);

  const filterdBeforeCursor = formatRaw(beforeCursor);
  const filterAfterCursor = formatRaw(afterCursor);

  const newText = filterdBeforeCursor + filterAfterCursor;
  const newCursor = filterdBeforeCursor.length;

  return [newText, newCursor];
};

const formatRaw = (value: string) => {
  let r = value.replace(/[^\d\s,.]/g, "");
  r = r.replace(/,/g, ".");
  r = r.replace(/\s+/g, "");
  return r;
};

export const NumberInput = ({
  name,
  control,
  integer,
  rules,
  placeholder,
  prefix,
  errors,
}: {
  name: string;
  control: Control<Record<string, any>>;
  integer?: boolean;
  rules?: RegisterOptions;
  placeholder?: string;
  prefix?: string;
  errors?: FieldError;
}) => {
  const { lang } = useSiteData();
  const runAfterUpdate = useRunAfterUpdate();

  const setFractional = (value: number) => {
    let r = value.toFixed(integer ? 0 : 2);
    if (lang !== "en") {
      r = r.replace(".", ",");
    }
    return r;
  };

  return (
    <div className="relative text-gray-700">
      <Controller
        name={name}
        rules={rules}
        defaultValue={null}
        render={(field) => (
          <input
            className={`w-full rounded-lg ${prefix ? "pl-8" : ""} ${
              errors ? "border-red-700" : ""
            }`}
            // type="number"
            type="text"
            placeholder={placeholder}
            aria-labelledby={`${name}-label`}
            aria-describedby={`${name}-error`}
            {...field}
            value={field.value != null ? setFractional(field.value) : ""}
            onChange={(e) => {
              const input = e.target;

              const [stripped, nextCursor] = formatPreservingCursor(
                input.value,
                input.selectionStart!
              );

              let parsed = integer
                ? parseInt(stripped, 10)
                : parseFloat(stripped);

              // ignore deleting the decimal
              if (!integer && parsed === Math.round(field.value * 100)) {
                parsed = field.value;
              }

              field.onChange(parsed || null);

              runAfterUpdate(() => {
                input.selectionStart = nextCursor;
                input.selectionEnd = nextCursor;
              });
            }}
          />
        )}
        control={control}
      />
      {prefix && (
        <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
          {prefix}
        </div>
      )}
    </div>
  );
};
