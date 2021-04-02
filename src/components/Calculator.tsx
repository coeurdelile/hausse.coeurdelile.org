import React, { useCallback, useState } from "react";
import { css } from "astroturf";
import { useForm, FieldError } from "react-hook-form";
import Modal from "react-modal";
import SwipeableViews from "react-swipeable-views";

import { Button } from "~/components/Button";
import { useSiteData } from "~/lib/site-data";
import { headings, subheader, mwxxs } from "~/styles/headings";

Modal.setAppElement("#__next");

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
  const { register, errors, watch } = useForm<FormVals>({
    mode: "onTouched",
  });

  const [activeModal, setActiveModal] = useState<"muni" | "school" | false>(
    false
  );
  const closeModal = useCallback(() => setActiveModal(false), []);

  const { t, lang } = useSiteData();

  const res = watch();

  const estimate = getEstimate(res);

  return (
    <>
      <div className="max-w-2xl px-4 mx-auto mb-8">
        <Section title={t("section-dwelling")}>
          <NumberGroup
            name="rent"
            placeholder="0.00"
            prefix="$"
            required
            label={t("rent-label")}
            help={t("rent-help")}
            errors={errors.rent}
            errorText={t("err-amount")}
            ref={register({
              required: true,
              min: 1,
            })}
          />
          <NumberGroup
            name="dwellings"
            // placeholder="5"
            required
            label={t("dwellings-label")}
            help={t("dwellings-help")}
            errors={errors.dwellings}
            errorText={t("err-amount")}
            ref={register({
              required: true,
              pattern: /\d{1,4}/,
              min: 1,
              max: 10_000,
              validate: {
                wholeNumber,
              },
            })}
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
          <InfoModal active={activeModal === "muni"} closeModal={closeModal}>
            <MuniModal closeModal={closeModal} />
          </InfoModal>
          <NumberGroup
            name="muni2021"
            placeholder="0.00"
            prefix="$"
            required
            label={t("muni2021-label")}
            errors={errors.muni2021}
            errorText={t("err-amount")}
            ref={register({ required: true })}
          />
          <NumberGroup
            name="muni2020"
            placeholder="0.00"
            prefix="$"
            required
            label={t("muni2020-label")}
            errors={errors.muni2020}
            errorText={t("err-amount")}
            ref={register({ required: true })}
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
          <InfoModal active={activeModal === "school"} closeModal={closeModal}>
            <SchoolModal closeModal={closeModal} />
          </InfoModal>
          <NumberGroup
            name="school2021"
            placeholder="0.00"
            prefix="$"
            required
            label={t("school2021-label")}
            errors={errors.school2021}
            errorText={t("err-amount")}
            ref={register({ required: true })}
          />
          <NumberGroup
            name="school2020"
            placeholder="0.00"
            prefix="$"
            required
            label={t("school2020-label")}
            errors={errors.school2020}
            errorText={t("err-amount")}
            ref={register({ required: true })}
          />
        </Section>
        <Section title={t("section-work")}>
          <NumberGroup
            name="workbuilding"
            placeholder="0.00"
            prefix="$"
            label={t("workbuilding-label")}
            help={t("workbuilding-help")}
            errors={errors.workbuilding}
            errorText={t("err-amount")}
            ref={register()}
          />
          <NumberGroup
            name="workdwelling"
            placeholder="0.00"
            prefix="$"
            label={t("workdwelling-label")}
            help={t("workdwelling-help")}
            errors={errors.workdwelling}
            errorText={t("err-amount")}
            ref={register()}
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

const MuniModal = ({ closeModal }: { closeModal: () => void }) => {
  const { t, lang } = useSiteData();

  const slides: [string, string | JSX.Element][] = [
    [
      "/images/ref1.png",
      <span key="ref1">
        {t("ref1-1")}
        <a
          className="underline"
          href="https://servicesenligne2.ville.montreal.qc.ca/sel/evalweb/"
        >
          {t("ref1-2")}
        </a>
        {t("ref1-3")}
      </span>,
    ],
    [lang === "en" ? "/images/ref2-en.png" : "/images/ref2-fr.png", t("ref2")],
    ["/images/ref3.png", t("ref3")],
    ["/images/ref4.png", t("ref4")],
    ["/images/ref5.png", t("ref5")],
  ];

  return (
    <HelpModal title={t("ref-title")} slides={slides} closeModal={closeModal} />
  );
};

const SchoolModal = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useSiteData();

  const slides: [string, string | JSX.Element][] = [
    [
      "/images/tfp1.png",
      <span key="tfp1txt">
        {t("tfp1-1")}
        <a className="underline" href="https://tfp.cgtsim.qc.ca/asp/tfp.aspx">
          {t("tfp1-2")}
        </a>
        {t("tfp1-3")}
      </span>,
    ],
    ["/images/tfp2.png", t("tfp2")],
    ["/images/tfp3.png", t("tfp3")],
    [
      "/images/tfp4.png",
      <div key="tpf4">
        <p>{t("tfp4-1")}</p>
        <p className="mt-2 text-gray-800 italic">{t("tfp4-2")}</p>
      </div>,
    ],
    ["/images/tfp5.png", t("tfp5")],
    ["/images/tfp6.png", t("tfp6")],
  ];

  return (
    <HelpModal title={t("tfp-title")} slides={slides} closeModal={closeModal} />
  );
};

const HelpModal = ({
  title,
  slides,
  closeModal,
}: {
  title: string;
  slides: [string, string | JSX.Element][];
  closeModal: () => void;
}) => {
  const { t } = useSiteData();
  const [slide, setSlide] = useState(0);
  const goToSlide = useCallback((e: React.MouseEvent) => {
    setSlide(parseInt(e.currentTarget.getAttribute("data-slide")!));
  }, []);

  const notLastSlide = slide < slides.length - 1;

  const dots = [];
  for (let i = 0; i < slides.length; i++) {
    dots.push(
      <div
        key={i}
        data-slide={i}
        onClick={goToSlide}
        className={`cursor-pointer border border-indigo-700 rounded-full w-2 h-2 mx-1 ${
          slide === i ? "bg-indigo-700" : ""
        }`}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className={`${headings} text-2xl uppercase font-bold italic px-4 mt-4 mb-4`}
      >
        {title}
      </div>
      <SwipeableViews
        className="h-full mb-4"
        slideClassName="flex flex-col justify-center"
        index={slide}
        onChangeIndex={(i) => {
          setSlide(i);
        }}
      >
        {slides.map(([image, text], i) => (
          <div key={i}>
            <img className="border border-black mx-auto mb-4" src={image} />
            <div className="mb-1 px-2 mx-auto max-w-xl">{text}</div>
          </div>
        ))}
      </SwipeableViews>
      <div className="w-full mt-auto px-4 mb-4 flex justify-between items-center">
        <Button
          onClick={() => {
            if (slide > 0) setSlide(slide - 1);
            else closeModal();
          }}
          className={`text-lg flex items-center h-8 pl-1 pr-3 text-white ${
            slide === 0
              ? "bg-indigo-400 hover:bg-indigo-500"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          <svg viewBox="0 0 24 24" width="24px" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
          </svg>
          <span>{t("back")}</span>
        </Button>
        <div className="flex">{dots}</div>
        <Button
          onClick={() => {
            if (notLastSlide) setSlide(slide + 1);
            else closeModal();
          }}
          className={`text-lg flex items-center h-8 pl-3 pr-1 text-white ${
            notLastSlide
              ? "pr-1 bg-indigo-700 hover:bg-indigo-800"
              : "pr-3 bg-green-700 hover:bg-green-800"
          }`}
        >
          <span>{notLastSlide ? t("next") : t("done")}</span>
          {notLastSlide && (
            <svg viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
};

const modalContent = css`
  position: absolute;
  top: 40px;
  left: 40px;
  right: 40px;
  bottom: 40px;
  border: 1px solid #ccc;
  background: #fff;
  overflow: auto;
  --webkit-overflow-scrolling: touch;
  outline: none;
  /* border-radius: 4px; */
  /* padding: 20px; */
`;

const InfoModal: React.FC<{
  active: boolean;
  closeModal: () => void;
}> = ({ active, closeModal, children }) => {
  return (
    <Modal
      className={modalContent}
      isOpen={active}
      closeTimeoutMS={300}
      onRequestClose={closeModal}
      contentLabel="modal"
    >
      {children}
    </Modal>
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

const NumberGroup = React.forwardRef<
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

const SelectGroup = React.forwardRef<
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
