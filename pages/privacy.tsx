import { Box, Flex, List, ListItem, Text } from "@chakra-ui/react";

import Card from "../components/Card";
import AppLayout from "../layouts/app";

interface SectionProps {
  title: React.ReactNode | string;
  content: React.ReactNode | string;
}

function Section({ title, content }: SectionProps) {
  return (
    <Flex flexDir="column" gap={1}>
      <Text fontSize="2xl" fontWeight="bold">
        {title}
      </Text>
      <Text lineHeight="7">{content}</Text>
    </Flex>
  );
}

export default function Privacy() {
  return (
    <Box p={6}>
      <Card p={8}>
        <Flex flexDir="column" gap={6}>
          <Flex flexDir="column">
            <Text as="h1" fontSize="3xl" fontWeight="bold">
              Privacy Policy
            </Text>
            <Text textColor="gray.500" fontStyle="italic">
              Last Updated: August 4th, 2022
            </Text>
          </Flex>
          <Section
            title="What is the purpose of this document?"
            content="This document is meant to provide you with the information you need to understand the type of data frequency collects from you, why, and the control you have over that data."
          />
          <Section
            title="What data do we collect?"
            content={
              <>
                In the pursuit of providing you with the best user experience
                possible, frequency stores data including, but not limited to:
                <List>
                  <ListItem>- Your Name</ListItem>
                  <ListItem>- Your Email</ListItem>
                  <ListItem>
                    - An image from the 3rd party auth provider you used to
                    register.
                  </ListItem>
                  <ListItem>- The habits you have created.</ListItem>
                  <ListItem>- Your history of habit completions.</ListItem>
                </List>
              </>
            }
          />
          <Section
            title="How is your data stored and protected?"
            content="Your data is stored in a database managed by a major cloud infrastructure provider that requires authentication to access. Your data is protected in transit by using the HTTPS protocol for data transfer between your browser and the web server."
          />
          <Section
            title="What control do you have over your data?"
            content="You can delete your account by clicking the gear icon in the top right of the frequency app and then clicking on the “Delete Account” button. This will permanently delete all data that we have related to your account."
          />
          <Section
            title="Can this policy change?"
            content="Yes, this policy can change at any time. The date at the top of the document will be updated whenever this privacy policy changes."
          />
        </Flex>
      </Card>
    </Box>
  );
}

(Privacy as any).getLayout = function getLayout(page: React.ReactNode) {
  return <AppLayout>{page}</AppLayout>;
};
