import React from "react";
// import { css } from "astroturf";
import { useForm } from "react-hook-form";

import SEO from "~/components/SEO";
import { useSiteData } from "~/lib/site-data";

import logo from "~/images/logo.svg";
import twitter from "~/images/twitter.svg";
import email from "~/images/email.svg";

import siteInfo from "~/lib/site-info.server";

import type { GetStaticProps } from "next";

const twUrl = `https://twitter.com/${siteInfo.twitter.slice(1)}`;

interface PageProps {
  body: string;
  title: string;
  description: string;
  image: string;
}

const protocol = "mailto:";
const address = "gentrification";
const domain = "coeurdelile.org";

const decodeEmail = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
  e.currentTarget.href = `${protocol}${address}@${domain}`;
};

const Index = ({ body, title, description, image }: PageProps) => {
  return (
    <>
      <SEO title={title} description={description} ogTitleOverride={title} />
      <img className="absolute top-4 left-4 w-16" src={logo} />
      <img className="mx-auto w-2/3 max-w-xl mt-16 mb-16" src={image} />

      <div className="max-w-xl mx-auto px-4 mb-16">
        <article
          className="prose max-w-xl mb-12"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        <Calculator />
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
  const { t } = useSiteData();
  const { register, errors } = useForm<{ rent: number }>({ mode: "onTouched" });

  return (
    <div className="max-w-xl mx-auto mb-16">
      <label className="block mb-1">{t("rent-desc")}</label>
      <div className="relative text-gray-700">
        <input
          className={`w-50 pl-6 rounded-lg ${
            errors.rent ? "border-red-700" : ""
          }`}
          name="rent"
          type="number"
          placeholder="500.00"
          aria-describedby="renthelp"
          ref={register({ required: true })}
        />
        <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
          $
        </div>
      </div>
      {errors.rent && (
        <span className="text-xs text-red-700" id="renthelp">
          {t("rent-err")}
        </span>
      )}
    </div>
  );
};

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
