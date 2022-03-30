import Head from "next/head";
import { langList, useSiteData } from "~/lib/site-data";
import siteInfo from "~/lib/site-info.server";

// import openGraphImage from "~/images/social-crop.png";

const { domain, twitter } = siteInfo;

const SEO = ({
  title,
  description,
  ogTitleOverride,
}: {
  title: string;
  description?: string;
  ogTitleOverride?: string;
}) => {
  const { t, lang } = useSiteData();

  const resolvedTitle = `${title} — ${t("siteName")}`;
  const resolvedDescription = description ?? t("site_description");

  return (
    <Head>
      <title>{resolvedTitle}</title>
      {langList.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${domain}/${l}`} />
      ))}
      <meta
        name="description"
        key="description"
        content={resolvedDescription}
      />
      <meta
        property="og:title"
        key="og:title"
        content={ogTitleOverride ?? resolvedTitle}
      />
      <meta
        property="og:description"
        key="og:description"
        content={resolvedDescription}
      />
      <meta property="og:image" content={`${domain}/og-${lang}.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitter} />
    </Head>
  );
};

export default SEO;
