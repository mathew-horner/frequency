import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import NiceModal from "@ebay/nice-modal-react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { IoLogIn, IoLogOut, IoSettingsSharp } from "react-icons/io5";

import Button from "../components/Button";
import SettingsModal from "../components/modals/SettingsModal";

export default function Navbar() {
  const session = useSession();

  function renderControls() {
    if (session.status === "loading") return null;
    return (
      <>
        {!!session.data ? (
          <>
            <Button
              type_="gray"
              size="lg"
              h={12}
              w={12}
              p={0}
              onClick={() => NiceModal.show(SettingsModal)}
            >
              <IoSettingsSharp size={24} />
            </Button>
            <Button
              type_="gray"
              size="lg"
              h={12}
              w={12}
              p={0}
              onClick={() => signOut()}
            >
              <IoLogOut size={24} />
            </Button>
          </>
        ) : (
          <Button
            type_="gray"
            size="lg"
            h={12}
            w={12}
            p={0}
            onClick={() => signIn()}
          >
            <IoLogIn size={24} />
          </Button>
        )}
      </>
    );
  }

  return (
    <Flex
      as="header"
      alignItems="center"
      pt={{ base: 3, sm: 6 }}
      px={{ base: 3, sm: 6 }}
      pb={0}
      gap={2}
    >
      {/* Site Brand */}
      <Link href="/app">
        <Flex alignItems="center" flexGrow={1} gap={2} cursor="pointer">
          <img
            src="/frequency-logo.png"
            height={48}
            width={48}
            style={{ borderRadius: "8px" }}
          />
          <Box position="relative">
            <Text
              as="h1"
              fontSize="3xl"
              fontWeight="bold"
              display={{ base: "none", sm: "block" }}
            >
              frequency
            </Text>
            <Text position="absolute" bottom={-3} left={0} textColor="gray.500">
              beta
            </Text>
          </Box>
        </Flex>
      </Link>

      {/* Controls */}
      {renderControls()}
    </Flex>
  );
}
