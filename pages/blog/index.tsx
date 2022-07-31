import fs from "fs";
import path from "path";

import { GetStaticProps } from "next";
import Link from "next/link";
import { Flex, Text } from "@chakra-ui/react";

import Card from "../../components/Card";
import JustDate from "../../utils/justDate";

interface BlogPost {
  title: string;
  subtext: string;
  slug: string;
  ageInDays: number;
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
            <Flex flexDir="column" flexGrow={1}>
              <Text as="h2" fontSize="xl" fontWeight="bold">
                {post.title}
              </Text>
              <Text
                as="p"
                fontSize="md"
                fontStyle="italic"
                textColor="gray.500"
              >
                {post.subtext}
              </Text>
            </Flex>
            <Text fontSize="md" textColor="gray.500">
              {post.ageInDays}d
            </Text>
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

  const stats = fs.statSync(postPath);
  const today = JustDate.today();
  const lastModified = JustDate.fromJsDate(new Date(stats.mtime));

  return {
    title: lines[0],
    subtext: lines[1],
    slug,
    ageInDays: 10,
  };
}

export const getStaticProps: GetStaticProps<Props> = (context) => {
  const postsPath = path.join(process.cwd(), "blog");
  const posts = fs.readdirSync(postsPath);
  const slugs = posts.map((post) => post.split(".")[0]);

  return {
    props: {
      posts: slugs.map((slug) => createBlogPost(slug)),
    },
  };
};
