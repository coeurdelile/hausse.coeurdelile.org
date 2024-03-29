import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/Button";
import { MuniModal, SchoolModal } from "~/components/Modal";
import { NumberGroup, SelectGroup } from "~/components/InputGroup";

import { useSiteData } from "~/lib/site-data";

import styles from "~/styles/utils.module.css";

const { fontheadings: headings, subheader } = styles;

// const positive = (value: any) => parseInt(value, 10) > 0;
// const lessThan10000 = (value: any) => parseInt(value, 10) < 10_000;
const wholeNumber = (value: any) =>
  parseInt(value) === Math.round(parseInt(value));

const heatingValuesByYear = {
  2021: {
    anyPaidBySelf: 0.008,
    electricPaidByLandlord: 0.005,
    gasPaidByLandlord: -0.003,
    oilPaidByLandlord: -0.023,
  },
  2022: {
    anyPaidBySelf: 0.0128,
    electricPaidByLandlord: 0.0134,
    gasPaidByLandlord: 0.0191,
    oilPaidByLandlord: 0.0373,
  },
};

const improvementRateByYear = {
  2021: 0.00192,
  2022: 0.00167,
};

interface FormVals {
  rent?: string;
  dwellings?: string;
  heat?: number;

  muniCurrent?: string;
  muniPrevious?: string;

  schoolCurrent?: string;
  schoolPrevious?: string;

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
              [
                t("I pay for heating myself"),
                heatingValuesByYear[2022].anyPaidBySelf,
              ],
              [
                t("My landlord pays for electric heating"),
                heatingValuesByYear[2022].electricPaidByLandlord,
              ],
              [
                t("My landlord pays for gas heating"),
                heatingValuesByYear[2022].gasPaidByLandlord,
              ],
              [
                t("My landlord pays for oil heating"),
                heatingValuesByYear[2022].oilPaidByLandlord,
              ],
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
            className="mb-4 flex items-center px-5 py-2 text-white bg-indigo-700 hover:bg-indigo-800"
          >
            <div className={`${headings} select-none text-xl mr-2`}>?</div>
            <span>{t("help-find")}</span>
          </Button>
          <MuniModal active={activeModal === "muni"} closeModal={closeModal} />

          <NumberGroup
            name="muniCurrent"
            placeholder={currencyPlaceholder}
            prefix="$"
            required
            label={t("muniCurrent-label")}
            errors={errors.muniCurrent}
            errorText={t("err-amount")}
            control={control}
            rules={{ required: true, min: 0 }}
          />
          <NumberGroup
            name="muniPrevious"
            placeholder={currencyPlaceholder}
            prefix="$"
            required
            label={t("muniPrevious-label")}
            errors={errors.muniPrevious}
            errorText={t("err-amount")}
            control={control}
            rules={{ required: true, min: 0 }}
          />
        </Section>
        <Section title={t("section-school")}>
          <Button
            onClick={() => setActiveModal("school")}
            className="mb-4 flex items-center px-5 py-2 text-white bg-indigo-700 hover:bg-indigo-800"
          >
            <div className={`${headings} select-none text-xl mr-2`}>?</div>
            <span>{t("help-find")}</span>
          </Button>
          <SchoolModal
            active={activeModal === "school"}
            closeModal={closeModal}
          />

          <NumberGroup
            name="schoolCurrent"
            placeholder={currencyPlaceholder}
            prefix="$"
            required
            label={t("schoolCurrent-label")}
            errors={errors.schoolCurrent}
            errorText={t("err-amount")}
            control={control}
            rules={{ required: true, min: 0 }}
          />
          <NumberGroup
            name="schoolPrevious"
            placeholder={currencyPlaceholder}
            prefix="$"
            required
            label={t("schoolPrevious-label")}
            errors={errors.schoolPrevious}
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
                className={`${headings} text-center text-6xl sm:text-8xl font-bold italic`}
              >
                {lang === "en"
                  ? `$${estimate[0]}`
                  : `${estimate[0].replace(".", ",")} $`}
              </div>
            </div>
          ) : (
            <div className="text-center text-2xl font-bold">
              {t("needfinish")}
            </div>
          )}
        </div>
        {/* eslint-disable-next-line @typescript-eslint/prefer-optional-chain */}
        {estimate && estimate[1] && (
          <div className="mt-4">
            <div className="text-lg font-bold">{t("neg-1")}</div>
            <div>{t("neg-2")}</div>
          </div>
        )}
      </div>
    </>
  );
};

function getEstimate({
  rent: strRent,
  dwellings: strDwellings,
  heat,
  muniCurrent: strMuniCurrent,
  muniPrevious: strMuniPrevious,
  schoolCurrent: strSchoolCurrent,
  schoolPrevious: strSchoolPrevious,
  workbuilding: strWorkbuilding,
  workdwelling: strWorkdwelling,
}: FormVals): [total: string, negative: boolean] | false {
  // FIXME later
  const rent = parseInt(strRent!);
  const dwellings = parseInt(strDwellings!);
  const muniCurrent = parseInt(strMuniCurrent!);
  const muniPrevious = parseInt(strMuniPrevious!);
  const schoolCurrent = parseInt(strSchoolCurrent!);
  const schoolPrevious = parseInt(strSchoolPrevious!);
  const workbuilding = parseInt(strWorkbuilding!);
  const workdwelling = parseInt(strWorkdwelling!);

  if (
    rent == null ||
    Number.isNaN(rent) ||
    dwellings == null ||
    Number.isNaN(dwellings) ||
    heat == null ||
    Number.isNaN(heat) ||
    muniPrevious == null ||
    Number.isNaN(muniPrevious) ||
    muniCurrent == null ||
    Number.isNaN(muniCurrent) ||
    schoolPrevious == null ||
    Number.isNaN(schoolPrevious) ||
    schoolCurrent == null ||
    Number.isNaN(schoolCurrent)
  ) {
    return false;
  }

  const base = rent * heat;

  const muni = (muniCurrent - muniPrevious) / dwellings / 12;
  const school = (schoolCurrent - schoolPrevious) / dwellings / 12;

  const work =
    ((workbuilding || 0) / dwellings + (workdwelling || 0)) *
    improvementRateByYear[2022];

  const total = base + muni + school + work;

  return [total.toFixed(2), total <= 0];
}

const Section: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className={subheader}>{title}</h2>
      {children}
    </div>
  );
};
