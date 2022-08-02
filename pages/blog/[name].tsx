import fs from "fs";
import path from "path";

import { GetStaticPaths, GetStaticProps } from "next";
import { Box, Flex } from "@chakra-ui/react";

import Card from "../../components/Card";
import Markdown from "../../components/Markdown";
import AppLayout from "../../layouts/app";

interface Props {
  content: string;
}

export default function Blog({ content }: Props) {
  return (
    <Box p={6}>
      <Card p={6}>
        <Flex flexDirection="column" gap={4} lineHeight={8}>
          <Markdown>{content}</Markdown>
        </Flex>
      </Card>
    </Box>
  );
}

(Blog as any).getLayout = function getLayout(page: React.ReactNode) {
  return <AppLayout>{page}</AppLayout>;
};

export const getStaticPaths: GetStaticPaths = () => {
  const postsPath = path.join(process.cwd(), "blog");
  const posts = fs.readdirSync(postsPath);
  const paths = posts.map((post) => ({
    params: {
      name: post.split(".")[0],
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = (context) => {
  const name = context.params?.name;

  if (name === undefined || Array.isArray(name)) {
    throw new Error("Name must be a string!");
  }

  const postPath = path.join(process.cwd(), "blog", `${name}.md`);

  if (!fs.existsSync(postPath)) {
    return {
      notFound: true,
    };
  }

  const content = fs.readFileSync(postPath).toString("utf-8");

  return {
    props: {
      content,
    },
  };
};
