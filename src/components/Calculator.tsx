import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/Button";
import { MuniModal, SchoolModal } from "~/components/Modal";
import { NumberGroup, SelectGroup } from "~/components/InputGroup";

import { useSiteData } from "~/lib/site-data";
import { headings, subheader, body } from "~/styles/utils";

// const positive = (value: any) => parseInt(value, 10) > 0;
// const lessThan10000 = (value: any) => parseInt(value, 10) < 10_000;
const wholeNumber = (value: any) =>
  parseInt(value, 10) === Math.round(parseInt(value, 10));

interface FormVals {
  rent?: string;
  dwellings?: string;
  heat?: number;

  muni2021?: string;
  muni2020?: string;

  school2021?: string;
  school2020?: string;

  workbuilding?: string;
  workdwelling?: string;
}

export const Calculator = () => {
  const { control, register, errors, watch } = useForm<FormVals>({
    mode: "onTouched",
  });

  const [activeModal, setActiveModal] = useState<"muni" | "school" | false>(
    false
  );
  const closeModal = useCallback(() => setActiveModal(false), []);

  const { t, lang } = useSiteData();

  const res = watch();

  const estimate = getEstimate(res);

  const currencyPlaceholder = lang === "en" ? "0.00" : "0,00";

  return (
    <>
      <div className="max-w-2xl px-4 mx-auto mb-8">
        <Section title={t("section-dwelling")}>
          <NumberGroup
            name="rent"
            placeholder={currencyPlaceholder}
            prefix="$"
            required
            label={t("rent-label")}
            help={t("rent-help")}
            errors={errors.rent}
            errorText={t("err-amount")}
            control={control}
            rules={{
              required: true,
              min: 1,
            }}
          />
          <NumberGroup
            name="dwellings"
            placeholder="0"
            required
            integer
            label={t("dwellings-label")}
            help={t("dwellings-help")}
            errors={errors.dwellings}
            errorText={t("err-amount")}
            control={control}
            rules={{
              required: true,
              pattern: /\d{1,4}/,
              min: 1,
              max: 10_000,
              validate: {
                wholeNumber,
              },
            }}
          />
          <SelectGroup
            name="heat"
            options={[
              [t("I pay for heating myself"), 0.008],
              [t("My landlord pays for electric heating"), 0.005],
              [t("My landlord pays for gas heating"), -0.003],
              [t("My landlord pays for oil heating"), -0.023],
            ]}
            label={t("heat-label")}
            help={t("heat-help")}
            errors={errors.heat}
            errorText={t("err-sel")}
            ref={register({ required: true })}
          />
        </Section>
        <Section title={t("section-municipal")}>
          <Button
            onClick={() => setActiveModal("muni")}
            className="mb-4 flex items-center h-10 px-5 text-white bg-indigo-700 hover:bg-indigo-800"
          >
            <div className={`${headings} select-none text-xl mr-2`}>?</div>
            <span>{t("help-find")}</span>
          </Button>
          <MuniModal active={activeModal === "muni"} closeModal={closeModal} />

          <NumberGroup
            name="muni2021"
            placeholder={currencyPlaceholder}
            prefix="$"
            required
            label={t("muni2021-label")}
            errors={errors.muni2021}
            errorText={t("err-amount")}
            control={control}
            rules={{ required: true, min: 0 }}
          />
          <NumberGroup
            name="muni2020"
            placeholder={currencyPlaceholder}
            prefix="$"
            required
            label={t("muni2020-label")}
            errors={errors.muni2020}
            errorText={t("err-amount")}
            control={control}
            rules={{ required: true, min: 0 }}
          />
        </Section>
        <Section title={t("section-school")}>
          <Button
            onClick={() => setActiveModal("school")}
            className="mb-4 flex items-center h-10 px-5 text-white bg-indigo-700 hover:bg-indigo-800"
          >
            <div className={`${headings} select-none text-xl mr-2`}>?</div>
            <span>{t("help-find")}</span>
          </Button>
          <SchoolModal
            active={activeModal === "school"}
            closeModal={closeModal}
          />

          <NumberGroup
            name="school2021"
            placeholder={currencyPlaceholder}
            prefix="$"
            required
            label={t("school2021-label")}
            errors={errors.school2021}
            errorText={t("err-amount")}
            control={control}
            rules={{ required: true, min: 0 }}
          />
          <NumberGroup
            name="school2020"
            placeholder={currencyPlaceholder}
            prefix="$"
            required
            label={t("school2020-label")}
            errors={errors.school2020}
            errorText={t("err-amount")}
            control={control}
            rules={{ required: true, min: 0 }}
          />
        </Section>
        <Section title={t("section-work")}>
          <NumberGroup
            name="workbuilding"
            placeholder={currencyPlaceholder}
            prefix="$"
            label={t("workbuilding-label")}
            help={t("workbuilding-help")}
            errors={errors.workbuilding}
            errorText={t("err-amount")}
            control={control}
          />
          <NumberGroup
            name="workdwelling"
            placeholder={currencyPlaceholder}
            prefix="$"
            label={t("workdwelling-label")}
            help={t("workdwelling-help")}
            errors={errors.workdwelling}
            errorText={t("err-amount")}
            control={control}
          />
        </Section>
      </div>
      <div className="max-w-xl mx-auto px-4 mb-8">
        <h2 className={`${headings} text-5xl font-bold italic uppercase mb-4`}>
          {t("estimate")}
        </h2>
        <div className="p-6 bg-pink-50 border border-black rounded-lg">
          {estimate ? (
            <div>
              <div
                className={`${headings} text-center text-8xl font-bold italic`}
              >
                {lang === "en"
                  ? `$${estimate}`
                  : `${estimate.replace(".", ",")} $`}
              </div>
            </div>
          ) : (
            <div className="text-center text-2xl font-bold">
              {t("needfinish")}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function getEstimate({
  rent: strRent,
  dwellings: strDwellings,
  heat,
  muni2021: strMuni2021,
  muni2020: strMuni2020,
  school2021: strSchool2021,
  school2020: strSchool2020,
  workbuilding: strWorkbuilding,
  workdwelling: strWorkdwelling,
}: FormVals): string | false {
  // FIXME later
  const rent = parseInt(strRent!);
  const dwellings = parseInt(strDwellings!);
  const muni2021 = parseInt(strMuni2021!);
  const muni2020 = parseInt(strMuni2020!);
  const school2021 = parseInt(strSchool2021!);
  const school2020 = parseInt(strSchool2020!);
  const workbuilding = parseInt(strWorkbuilding!);
  const workdwelling = parseInt(strWorkdwelling!);

  if (
    rent == null ||
    isNaN(rent) ||
    dwellings == null ||
    isNaN(dwellings) ||
    heat == null ||
    isNaN(heat) ||
    muni2020 == null ||
    isNaN(muni2020) ||
    muni2021 == null ||
    isNaN(muni2021) ||
    school2020 == null ||
    isNaN(school2020) ||
    school2021 == null ||
    isNaN(school2021)
  ) {
    return false;
  }

  const base = rent * heat;

  const muni = (muni2021 - muni2020) / dwellings / 12;
  const school = (school2021 - school2020) / dwellings / 12;

  const work =
    ((workbuilding || 0) / dwellings + (workdwelling || 0)) * 0.00192;

  return (base + muni + school + work).toFixed(2);
}

const Section: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className={subheader}>{title}</h2>
      {children}
    </div>
  );
};
