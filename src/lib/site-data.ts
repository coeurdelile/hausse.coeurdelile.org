import { useRouter } from "next/router";

import en from "content/strings/strings.en.json";
// import fr from "content/strings/strings.fr.json";

export const DEFAULT_LANG = "en";

export const langs = {
  en: "English",
  // fr: "Français",
} as const;

export const langList = Object.keys(langs);

const localeData: { [lang: string]: Record<string, string> } = {
  en,
  // fr,
};

export function useSiteData() {
  const router = useRouter();

  const lang = router.query["lang"] as string;

  return {
    lang,
    langs,
    t: (id: string) => {
      if (localeData[lang][id]) return localeData[lang][id];
      console.warn(`Locale string not found for id "${id}" in lang "${lang}"`);
      return localeData[DEFAULT_LANG][id] || id;
    },
    setLang: (nextLang: string) => {
      if (!router.query["lang"]) {
        console.warn("Trying to set language, but not on a localized route!");
        return;
      }

      if (nextLang !== lang) {
        const nextRoute = Object.entries(router.query)
          .filter(([key]) => key !== "lang")
          .reduce(
            (acc, [k, v]) => acc.replace(`[${k}]`, v as string),
            router.route
          )
          .replace(`[lang]`, nextLang);

        router.push(router.route, nextRoute).catch((e) => console.error(e));
      }
    },
  };
}
