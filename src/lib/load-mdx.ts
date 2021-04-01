import { promises as fs } from "fs";
import renderToString from "next-mdx-remote/render-to-string";
import fm from "front-matter";
// import remark from "remark";
// import strip from "strip-markdown";

// import { components } from "~/components/mdx";
// import { summarize } from "~/lib/util";

const mdx = (content: string) => renderToString(content, { components: {} });

export async function loadMdx(filename: string) {
  const file = await fs.readFile(filename, "utf-8");
  const { attributes, body } = fm<Record<string, string>>(file);

  const contents = (await mdx(body)).renderedOutput;

  // const { contents: plaintext } = await remark().use(strip).process(body);
  // const description = summarize(contents["description"], 160);

  return { attributes, contents };
}
