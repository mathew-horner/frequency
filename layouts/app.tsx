import { Flex } from "@chakra-ui/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <Flex flexDir="column" alignItems="center" minH="100vh">
      <Flex width="full" flexDir="column" maxWidth="1000px" flexGrow={1}>
        <Navbar />
        {children}
      </Flex>
      <footer>
        <Footer />
      </footer>
    </Flex>
  );
}
