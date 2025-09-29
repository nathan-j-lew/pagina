import fs from "fs";
import path from "path";
import matter from "gray-matter";

const spreadsDirectory = path.join(process.cwd(), "src/spreads/");

export type SpreadData = {
  title: string;
  hex: string;
  slug: string;
  order: number;
  position: "start" | "end";
};

export function getSortedSpreadsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(spreadsDirectory);
  const allSpreadsData: { [key: string]: any }[] = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get id
    const slug = fileName.replace(/\.mdx$/, "");

    // Read markdown file as string
    const fullPath = path.join(spreadsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the slug
    return {
      slug,
      ...matterResult.data,
    };
  });
  // Sort spreads by order
  return allSpreadsData.sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getSpreadSlugs() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(spreadsDirectory);
  return fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get id
    return {
      params: {
        slug: fileName.replace(/\.mdx$/, ""),
      },
    };
  });
}

export function getSpreadData(slug: string) {
  const fullPath = path.join(spreadsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Combine the data with the id
  return {
    slug,
    ...matterResult.data,
  };
}
