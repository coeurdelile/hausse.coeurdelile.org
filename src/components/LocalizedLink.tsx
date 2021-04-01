import React from "react";
import Link from "next/link";

import { useSiteData } from "~/lib/site-data";

const LocalizedLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const { lang } = useSiteData();

  // currently doesn't seem worth it to support relative links
  if (!href.startsWith("/")) {
    console.warn(`<LocalizedLink> using relative href: "${href}"`);
    console.warn(`only absolute uris are currently supported.`);
  }

  return (
    <Link href={`/${lang}${href}`}>
      <a>{children}</a>
    </Link>
  );
};

export default LocalizedLink;
