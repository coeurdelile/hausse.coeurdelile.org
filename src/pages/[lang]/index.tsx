import React from "react";

import SEO from "~/components/SEO";
import { Button } from "~/components/Button";
import { Calculator } from "~/components/Calculator";
import { useSiteData } from "~/lib/site-data";

import logo from "~/images/logo.svg";
import twitter from "~/images/twitter.svg";
import email from "~/images/email.svg";

import siteInfo from "~/lib/site-info.server";

import styles from "~/styles/utils.module.css";

import type { GetStaticProps } from "next";

const { fontheadings: headings } = styles;

const twUrl = `https://twitter.com/${siteInfo.twitter.slice(1)}`;

const protocol = "mailto:";
const address = "gentrification";
const domain = "coeurdelile.org";

const decodeEmail = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
  e.currentTarget.href = `${protocol}${address}@${domain}`;
};

interface PageProps {
  intro: string;
  outro: string;
  title: string;
  description: string;
  image: string;
}

const Index = ({ intro, outro, title, description, image }: PageProps) => {
  const { t, lang } = useSiteData();

  return (
    <>
      <SEO title={title} description={description} ogTitleOverride={title} />
      <img className="absolute top-4 left-4 w-16" src={logo} />
      <div className="absolute top-4 right-4 w-16">
        {lang === "en" ? <a href="/fr">Français</a> : <a href="/en">English</a>}
      </div>
      <img
        className="mx-auto px-2 md:px-0 w-full md:w-2/3 max-w-xl mt-16"
        src={image}
      />
      <div
        className={`${headings} mx-auto w-64 h-64 p-6 rounded-full bg-pink-400 text-4xl text-center font-bold flex justify-center items-center mb-8`}
      >
        {t("updatedForYear")}
      </div>

      <a href="#calc">
        <Button className="mx-auto mb-12 flex items-center px-5 py-2 text-xl text-white bg-indigo-700 hover:bg-indigo-800">
          <svg
            className="w-6 h-6 mr-3 fill-current"
            width={24}
            height={24}
            viewBox="4 4 16 16"
          >
            <rect height="1.5" width="5" x="6.25" y="7.72" />
            <rect height="1.5" width="5" x="13" y="15.75" />
            <rect height="1.5" width="5" x="13" y="13.25" />
            <polygon points="8,18 9.5,18 9.5,16 11.5,16 11.5,14.5 9.5,14.5 9.5,12.5 8,12.5 8,14.5 6,14.5 6,16 8,16" />
            <polygon points="14.09,10.95 15.5,9.54 16.91,10.95 17.97,9.89 16.56,8.47 17.97,7.06 16.91,6 15.5,7.41 14.09,6 13.03,7.06 14.44,8.47 13.03,9.89" />
          </svg>
          <span>{t("goto-calc")}</span>
        </Button>
      </a>

      <div className="max-w-xl mx-auto px-4 mb-8">
        <article
          className="prose max-w-xl mb-8"
          dangerouslySetInnerHTML={{ __html: intro }}
        />
        <div
          className="mb-12 px-4 py-3 bg-pink-50 text-gray-900 border border-black rounded-lg"
          role="complementary"
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
          <aside
            className="max-w-xl mb-8"
            dangerouslySetInnerHTML={{ __html: outro }}
          />
          <hr />
        </div>
        <img className="mx-auto w-2/3 mb-8" src={logo} />
        <div className="flex flex-col items-center mb-12">
          <div className="mb-4 font-bold">
            <a className="flex items-center" href={twUrl}>
              <img width={18} className="inline mr-2 max-h-6" src={twitter} />
              {siteInfo.twitter}
            </a>
          </div>
          <div className="mb-4 font-bold">
            <a
              className="flex items-center"
              onMouseEnter={decodeEmail}
              onTouchStart={decodeEmail}
              onFocus={decodeEmail}
            >
              <img width={18} className="inline mr-2 max-h-6" src={email} />
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

export const getStaticProps: GetStaticProps<
  PageProps,
  { lang: string }
> = async ({ params }) => {
  const { loadMdx } = await import("~/lib/load-mdx");
  const { lang } = params!;

  const introPath = `content/pages/home-intro/intro.${lang}.md`;
  const outroPath = `content/pages/home-outro/outro.${lang}.md`;

  const { contents: intro, attributes } = await loadMdx(introPath);

  const { title, description, image } = attributes;

  if (!title) {
    throw new Error(`title must not be empty! (in ${introPath})`);
  }
  if (!description) {
    throw new Error(`description must not be empty! (in ${introPath})`);
  }
  if (!description) {
    throw new Error(`image must not be empty! (in ${introPath})`);
  }

  const { contents: outro } = await loadMdx(outroPath);

  return {
    props: {
      intro,
      outro,
      title,
      description,
      image,
    },
  };
};

export { getStaticPaths } from "~/lib/default-localized-static-paths";

export default Index;
