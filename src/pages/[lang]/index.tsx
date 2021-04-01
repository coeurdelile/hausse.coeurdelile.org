import React from "react";
import { css } from "astroturf";
import { useForm, FieldError } from "react-hook-form";

import SEO from "~/components/SEO";
import { useSiteData } from "~/lib/site-data";

import logo from "~/images/logo.svg";
import twitter from "~/images/twitter.svg";
import email from "~/images/email.svg";

import siteInfo from "~/lib/site-info.server";

import type { GetStaticProps } from "next";

const twUrl = `https://twitter.com/${siteInfo.twitter.slice(1)}`;

const protocol = "mailto:";
const address = "gentrification";
const domain = "coeurdelile.org";

const decodeEmail = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
  e.currentTarget.href = `${protocol}${address}@${domain}`;
};

const headings = css`
  font-family: var(--font-headings);
`;

const subheader = css`
  composes: text-2xl font-bold mb-5 from global;
`;

const hr = css`
  width: 30%;
  margin-left: "auto";
  margin-right: "auto";
  border-color: "#101316";
`;

interface PageProps {
  body: string;
  title: string;
  description: string;
  image: string;
}

const Index = ({ body, title, description, image }: PageProps) => {
  const { t } = useSiteData();

  return (
    <>
      <SEO title={title} description={description} ogTitleOverride={title} />
      <img className="absolute top-4 left-4 w-16" src={logo} />
      <img
        className="mx-auto px-2 md:px-0 w-full md:w-2/3 max-w-xl mt-16 mb-16"
        src={image}
      />

      <a href="#calc">
        <Button className="mx-auto mb-12 flex items-center h-10 px-5 py-6 text-xl text-white bg-indigo-700 hover:bg-indigo-800">
          <svg className="w-4 h-4 mr-3 fill-current" viewBox="0 0 20 20">
            <path
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
          <span>{t("goto-calc")}</span>
        </Button>
      </a>

      <div className="max-w-xl mx-auto px-4 mb-8">
        <article
          className="prose max-w-xl mb-8"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        <div
          className="mb-12 px-4 py-3 leading-normal bg-pink-50 text-gray-900 border border-black rounded-lg"
          role="alert"
        >
          <p>{t("desktop")}</p>
        </div>
        <h1
          id="calc"
          className={`${headings} text-5xl font-bold italic uppercase`}
        >
          {t("calc")}
        </h1>
      </div>
      <Calculator />
      <div className="max-w-xl mx-auto px-4 mb-16">
        <div className="prose mb-12">
          <hr />
        </div>
        <img className="mx-auto w-2/3 mb-8" src={logo} />
        <div className="flex flex-col items-center mb-12">
          <div className="mb-4 font-bold">
            <a className="flex" href={twUrl}>
              <img width={18} className="inline mr-2" src={twitter} />
              {siteInfo.twitter}
            </a>
          </div>
          <div className="mb-4 font-bold">
            <a
              className="flex"
              onMouseEnter={decodeEmail}
              onTouchStart={decodeEmail}
              onFocus={decodeEmail}
            >
              <img width={18} className="inline mr-2" src={email} />
              {address}
              <span>&#64;</span>
              {domain}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const Button: React.FC<{ className?: string }> = ({
  className = "",
  children,
}) => {
  return (
    <button
      className={`transition-colors duration-150 rounded-lg focus:shadow-outline ${className}`}
    >
      {children}
    </button>
  );
};

const positive = (value: any) => parseInt(value, 10) > 0;
const lessThan10000 = (value: any) => parseInt(value, 10) < 10_000;
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

const Calculator = () => {
  const { register, errors, watch } = useForm<FormVals>({
    mode: "onTouched",
  });

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
          <Button className="mb-4 flex items-center h-10 px-5 text-white bg-indigo-700 hover:bg-indigo-800">
            <div className={`${headings} select-none text-xl mr-2`}>?</div>
            <span>{t("help-find")}</span>
          </Button>
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
          <Button className="mb-4 flex items-center h-10 px-5 text-white bg-indigo-700 hover:bg-indigo-800">
            <div className={`${headings} select-none text-xl mr-2`}>?</div>
            <span>{t("help-find")}</span>
          </Button>
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
      <div className="max-w-xl mx-auto px-4 mb-16">
        <h2 className={`${headings} text-4xl font-bold italic uppercase mb-4`}>
          {t("estimate")}
        </h2>
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
          <div className="text-center text-xl font-bold">{t("needfinish")}</div>
        )}
      </div>
    </>
  );
};

function getEstimate({
  rent: s_rent,
  dwellings: s_dwellings,
  heat,
  muni2021: s_muni2021,
  muni2020: s_muni2020,
  school2021: s_school2021,
  school2020: s_school2020,
  workbuilding: s_workbuilding,
  workdwelling: s_workdwelling,
}: FormVals): string | false {
  // FIXME later
  const rent = parseInt(s_rent!);
  const dwellings = parseInt(s_dwellings!);
  const muni2021 = parseInt(s_muni2021!);
  const muni2020 = parseInt(s_muni2020!);
  const school2021 = parseInt(s_school2021!);
  const school2020 = parseInt(s_school2020!);
  const workbuilding = parseInt(s_workbuilding!);
  const workdwelling = parseInt(s_workdwelling!);

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
          <div className="mb-1 md:mb-0 md:w-1/2 md:pr-2">
            <label id={`${name}-label`}>{label}</label>
            {/* {required && (
              <span aria-hidden className="ml-1 font-bold">
                *
              </span>
            )} */}
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

export const getStaticProps: GetStaticProps<
  PageProps,
  { lang: string }
> = async ({ params }) => {
  const { loadMdx } = await import("~/lib/load-mdx");
  const { lang } = params!;

  const path = `content/pages/home/home.${lang}.md`;

  const { contents, attributes } = await loadMdx(path);

  const title = attributes["title"];
  const description = attributes["description"];
  const image = attributes["image"];

  if (!title) {
    throw new Error(`title must not be empty! (in ${path})`);
  }
  if (!description) {
    throw new Error(`description must not be empty! (in ${path})`);
  }
  if (!description) {
    throw new Error(`image must not be empty! (in ${path})`);
  }

  return {
    props: {
      body: contents,
      title,
      description,
      image,
    },
  };
};

export { getStaticPaths } from "~/lib/default-localized-static-paths";

export default Index;
