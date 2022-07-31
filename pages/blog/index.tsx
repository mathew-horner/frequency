import fs from "fs";
import path from "path";

import { GetStaticProps } from "next";
import Link from "next/link";
import { Box, Flex } from "@chakra-ui/react";

import Card from "../../components/Card";
import Markdown from "../../components/Markdown";

interface BlogPost {
  title: string;
  slug: string;
}

interface Props {
  posts: BlogPost[];
}

export default function BlogIndex({ posts }: Props) {
  return (
    <Flex p={6} flexDir="column" gap={4}>
      {posts.map((post) => (
        <Link href={`/blog/${post.slug}`}>
          <Card key={post.slug} display="flex" cursor="pointer" gap={4}>
            <Box flexGrow={1}>
              <Markdown>{post.title}</Markdown>
            </Box>
          </Card>
        </Link>
      ))}
    </Flex>
  );
}

/**
 * Takes a blog post slug and gets the title and subtext from the post file to
 * accompany it.
 */
function createBlogPost(slug: string): BlogPost {
  const postPath = path.join(process.cwd(), "blog", `${slug}.md`);
  const content = fs.readFileSync(postPath).toString("utf-8");
  const lines = content.split("\n").filter((line) => line.trim());

  if (lines.length < 2) {
    throw new Error(
      "Improper blog post format! Title and subtext could not be inferred."
    );
  }

  return {
    title: [lines[0], lines[1]].join("\n"),
    slug,
  };
}

export const getStaticProps: GetStaticProps<Props> = (_context) => {
  const postsPath = path.join(process.cwd(), "blog");
  const posts = fs.readdirSync(postsPath);
  const slugs = posts.map((post) => post.split(".")[0]);

  return {
    props: {
      posts: slugs.map((slug) => createBlogPost(slug)),
    },
  };
};
