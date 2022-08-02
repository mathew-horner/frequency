import Link from "next/link";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useRef } from "react";

import Button from "../components/Button";
import Footer from "../components/Footer";
// import TestimonialCard from "../components/TestimonialCard";

export default function LandingPage() {
  const infoSectionRef = useRef<HTMLDivElement>(null);

  function scrollToInfo() {
    infoSectionRef?.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Flex flexDir="column" overflowX="hidden">
      <Flex flexDir="column" h="100vh" minH="700px">
        <Box p={4}>
          {/* Site Brand */}
          <Link href="/">
            <Flex alignItems="center" gap={2} flexGrow={1} cursor="pointer">
              <img
                src="/frequency-logo.png"
                height={48}
                width={48}
                style={{ borderRadius: "8px" }}
              />
              <Text
                as="h1"
                fontSize="3xl"
                fontWeight="bold"
                display={{ base: "none", sm: "block" }}
              >
                frequency
              </Text>
            </Flex>
          </Link>
        </Box>

        {/* Hero Section */}
        <Flex
          flexDir="column"
          gap={8}
          p={6}
          backgroundColor="black"
          textColor="white"
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Text as="h1" fontSize="5xl" fontWeight="bold">
            Build habits the right way.
          </Text>
          <Text as="p" fontSize="xl" textColor="gray.300">
            Life is busy, and chaotic. Your habit tracker should reflect that.
            With frequency, you will build the habits you need to live the life
            you want, with a method that works with even the most hectic of
            schedules.
          </Text>
          <Flex gap={4}>
            <Button
              type_="white"
              w={44}
              size="lg"
              onClick={() => scrollToInfo()}
            >
              Learn More
            </Button>
            <Link href="/app">
              <Button type_="white-outline" w={44} size="lg">
                Try Now (Beta)
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>

      {/* Info Section */}
      <Flex
        flexDir="column"
        gap={{ base: 8, lg: 16 }}
        p={{ base: 8, lg: 16 }}
        ref={infoSectionRef}
      >
        <Flex flexDir="column" gap={8}>
          <Text fontSize="4xl" fontWeight="bold">
            Habit trackers are getting it wrong.
          </Text>
          <Text fontSize="lg">
            Most habit trackers force you into rigid schedules that don&apos;t
            work with real lives. Scheduling habits for specific days introduces
            too much rigidity into your life, and trying to do a little bit of
            each habit every day doesn&apos;t scale.
          </Text>
        </Flex>
        <Flex flexDir="column" gap={8}>
          <Text fontSize="4xl" fontWeight="bold">
            How frequency is different.
          </Text>
          <Text fontSize="lg">
            frequency takes a new approach to building habits that we call the{" "}
            <b>frequency method</b>. Here&apos;s how it works:
          </Text>
          <Text fontSize="lg">
            Each habit has a <b>frequency</b>, which is set by you, the user.
            This number represents how many days you can take to complete the
            habit one time. Once you complete the habit, starting on the
            following day, you have the same number of days to complete the
            habit again. Repeat ad infinitum. You are able to complete habits
            ahead of schedule if you&apos;d like, and habits will continue to show up
            on your feed if they are past due until you complete them.
          </Text>
          <Text fontSize="lg">
            The key features of this method are its scalability and flexibility.
            By not having to cram every habit into every day, you can build more
            habits in total. By being able to complete habits ahead or behind
            schedule, you can plan ahead for habits you&apos;re likely to miss, or
            make up for habits that you already missed.
          </Text>
        </Flex>
      </Flex>

      {/* Testimonials Section */}
      {/*<Flex
        flexDir="column"
        backgroundColor="gray.500"
        textColor="white"
        gap={8}
        p={{ base: 8, lg: 16 }}
      >
        <Text fontSize="4xl" fontWeight="bold">
          Don't take it from us...
        </Text>
        <Flex gap={4} overflowX="auto">
          <TestimonialCard
            name="Mathew Horner"
            job="Software Engineer"
            imageUrl="https://avatars.githubusercontent.com/u/33100798?v=4"
            quote="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          />
          <TestimonialCard
            name="Mathew Horner"
            job="Software Engineer"
            imageUrl="https://avatars.githubusercontent.com/u/33100798?v=4"
            quote="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          />
          <TestimonialCard
            name="Mathew Horner"
            job="Software Engineer"
            imageUrl="https://avatars.githubusercontent.com/u/33100798?v=4"
            quote="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          />
        </Flex>
      </Flex>*/}

      {/* Get Started Prompt */}
      <Flex
        flexDir="column"
        p={16}
        gap={16}
        alignItems="center"
        backgroundColor="gray.50"
        borderTop="2px"
        borderTopColor="gray.100"
      >
        <Text fontSize="4xl" textAlign="center">
          Ready to try the beta version for free?
        </Text>
        <Link href="/app">
          <Button type_="black" fontSize="4xl" p={8}>
            Get Started
          </Button>
        </Link>
      </Flex>

      {/* Footer */}
      <Footer />
    </Flex>
  );
}
