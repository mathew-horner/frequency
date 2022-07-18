import { useSession, signIn, signOut } from "next-auth/react";
import NiceModal from "@ebay/nice-modal-react";
import { Flex, Text } from "@chakra-ui/react";
import { IoLogIn, IoLogOut, IoSettingsSharp } from "react-icons/io5";
import { TbWaveSawTool } from "react-icons/tb";

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
      <Flex alignItems="center" gap={2} flexGrow={1}>
        <Flex
          alignItems="center"
          justifyContent="center"
          backgroundColor="black"
          textColor="white"
          p={2}
          borderRadius="lg"
        >
          <TbWaveSawTool size={32} />
        </Flex>
        <Text
          as="h1"
          fontSize="3xl"
          fontWeight="bold"
          display={{ base: "none", sm: "block" }}
        >
          frequency
        </Text>
      </Flex>

      {/* Controls */}
      {renderControls()}
    </Flex>
  );
}
