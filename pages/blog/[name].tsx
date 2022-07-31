import fs from "fs";
import path from "path";

import { GetStaticPaths, GetStaticProps } from "next";
import { Box, Flex, Text, TextProps } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

import Card from "../../components/Card";

interface Props {
  content: string;
}

/**
 * Returns a function that can be used as a renderer for links in the ReactMarkdown
 * components props. */
function linkRenderer(props: TextProps) {
  const text = textRenderer(props);
  return ({ children, href }: any) =>
    text({ children: <a href={href}>{children}</a> });
}

/**
 * Returns a function that can be used as a renderer for text in the ReactMarkdown
 * components props. */
function textRenderer(props: TextProps) {
  return ({ children }: any) => <Text {...props}>{children}</Text>;
}

export default function Blog({ content }: Props) {
  return (
    <Box p={6}>
      <Card p={6}>
        <Flex flexDirection="column" gap={4} lineHeight={8}>
          <ReactMarkdown
            components={{
              h1: textRenderer({
                fontSize: "3xl",
                fontWeight: "bold",
              }),
              h2: textRenderer({
                fontSize: "2xl",
                fontWeight: "bold",
              }),
              h3: textRenderer({
                fontSize: "xl",
                fontWeight: "bold",
              }),
              a: linkRenderer({
                cursor: "pointer",
                textColor: "blue.500",
                textDecoration: "underline",
              }),
              blockquote: ({ children }) => (
                <Box
                  backgroundColor="gray.200"
                  py={2}
                  px={4}
                  borderLeft="8px"
                  borderLeftColor="gray.400"
                >
                  {children}
                </Box>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </Flex>
      </Card>
    </Box>
  );
}

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
