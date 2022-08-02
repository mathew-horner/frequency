import { Flex, Text } from "@chakra-ui/react";
import Card from "./Card";

interface Props {
  name: string;
  job: string;
  imageUrl: string;
  quote: string;
}

export default function TestimonialCard({ name, job, imageUrl, quote }: Props) {
  return (
    <Card backgroundColor="white" textColor="black" minW={450} w={450}>
      <Flex alignItems="center" gap={2}>
        <img
          width={64}
          height={64}
          style={{ borderRadius: "9999px" }}
          src={imageUrl}
        />
        <Flex flexDir="column">
          <Text fontSize="lg" fontWeight="bold">
            {name}
          </Text>
          <Text fontSize="sm" textColor="gray.500">
            {job}
          </Text>
        </Flex>
      </Flex>
      <Text
        as="blockquote"
        mt={4}
        backgroundColor="gray.200"
        borderLeft="solid 4px"
        borderLeftColor="gray.500"
        p={3}
      >
        {quote}
      </Text>
    </Card>
  );
}
