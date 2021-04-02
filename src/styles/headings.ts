import { css } from "astroturf";

export const headings = css`
  font-family: var(--font-headings);
`;

export const subheader = css`
  composes: text-2xl font-bold mb-5 from global;
`;

export const mwxxs = css`
  max-width: 10rem;
`;
