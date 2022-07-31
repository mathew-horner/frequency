import ReactMarkdown from "react-markdown";
import { Box, Text, TextProps } from "@chakra-ui/react";

interface Props {
  children: string;
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

export default function Markdown({ children }: Props) {
  return (
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
      {children}
    </ReactMarkdown>
  );
}
