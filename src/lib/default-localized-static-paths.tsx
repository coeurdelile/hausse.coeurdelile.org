import type { GetStaticPaths } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  const { langList } = await import("~/lib/site-data");

  return {
    paths: langList.map((lang) => ({ params: { lang } })),
    fallback: false,
  };
};
