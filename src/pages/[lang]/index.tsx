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
  composes: text-2xl font-bold mb-4 from global;
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
      <img className="mx-auto w-2/3 max-w-xl mt-16 mb-16" src={image} />

      <a href="#calc">
        <button className="mx-auto mb-12 flex items-center h-10 px-5 py-6 text-xl text-white transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
          <svg className="w-4 h-4 mr-3 fill-current" viewBox="0 0 20 20">
            <path
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
          <span>{t("goto-calc")}</span>
        </button>
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

const Calculator = () => {
  const { register, errors } = useForm<{
    rent: number;
    dwellings: number;
    heat: number;
  }>({
    mode: "onTouched",
  });
  const { t } = useSiteData();

  return (
    <div className="max-w-2xl px-4 mx-auto mb-16">
      <div className="mb-6">
        <h2 className={subheader}>{t("section-dwelling")}</h2>
        <NumberGroup
          name="rent"
          placeholder="500.00"
          prefix="$"
          label={t("rent-label")}
          help={t("rent-help")}
          errors={errors.rent}
          errorText={t("err-amount")}
          ref={register({ required: true })}
        />
        <NumberGroup
          name="dwellings"
          placeholder="5"
          label={t("dwellings-label")}
          help={t("dwellings-help")}
          errors={errors.dwellings}
          errorText={t("err-amount")}
          ref={register({
            required: true,
            pattern: /\d{1,4}/,
            validate: {
              positive: (value) => parseInt(value, 10) > 0,
              lessThan10000: (value) => parseInt(value, 10) < 10_000,
              wholeNumber: (value) =>
                parseInt(value, 10) === Math.round(parseInt(value, 10)),
            },
          })}
        />
        <SelectGroup
          name="heat"
          options={[
            t("I pay for heating myself"),
            t("My landlord pays for electric heating"),
            t("My landlord pays for gas heating"),
            t("My landlord pays for oil heating"),
          ]}
          label={t("heat-label")}
          help={t("heat-help")}
          errors={errors.heat}
          errorText={t("err-amount")}
          ref={register({ required: true })}
        />
      </div>
      <h2 className={subheader}>{t("section-municipal")}</h2>
    </div>
  );
};

const NumberGroup = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    placeholder: string;
    prefix?: string;
    label: string;
    help: string;
    errors?: FieldError;
    errorText: string;
  }
>(({ name, placeholder, prefix, label, help, errors, errorText }, ref) => {
  return (
    <div className="mb-4">
      <div className="md:flex md:items-center">
        <div className="mb-1 md:mb-0 md:w-1/2">
          <label id={`${name}-label`}>{label}</label>
          <span className="ml-4 font-bold text-gray-400">
            <abbr title={help}>?</abbr>
          </span>
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
});
NumberGroup.displayName = "InputGroup";

const SelectGroup = React.forwardRef<
  HTMLSelectElement,
  {
    name: string;
    options: string[];
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
          <span className="ml-4 font-bold text-gray-400">
            <abbr title={help}>?</abbr>
          </span>
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
              {options.map((o, i) => (
                <option value={i} key={o}>
                  {o}
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
