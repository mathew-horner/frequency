import { useSession, signIn, signOut } from "next-auth/react";
import NiceModal from "@ebay/nice-modal-react";
import { Flex, Text, Button } from "@chakra-ui/react";
import { IoLogIn, IoLogOut, IoSettingsSharp } from "react-icons/io5";
import { TbWaveSawTool } from "react-icons/tb";

import SettingsModal from "../components/SettingsModal";

export default function Navbar() {
  const session = useSession();
  return (
    <Flex as="header" alignItems="center" p={6} pb={0} gap={2}>
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
        <Text as="h1" fontSize="3xl" fontWeight="bold">
          frequency
        </Text>
      </Flex>

      {/* Controls */}
      {!!session.data ? (
        <>
          <Button
            size="lg"
            h={12}
            w={12}
            p={0}
            onClick={() => NiceModal.show(SettingsModal)}
          >
            <IoSettingsSharp size={24} />
          </Button>
          <Button size="lg" h={12} w={12} p={0} onClick={() => signOut()}>
            <IoLogOut size={24} />
          </Button>
        </>
      ) : (
        <Button size="lg" h={12} w={12} p={0} onClick={() => signIn()}>
          <IoLogIn size={24} />
        </Button>
      )}
    </Flex>
  );
}
