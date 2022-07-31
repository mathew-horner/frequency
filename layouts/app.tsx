import { Box, Flex } from "@chakra-ui/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <Flex flexDir="column" alignItems="center" minH="100vh">
      <Box width="full" maxWidth="1000px" flexGrow={1}>
        <Navbar />
        {children}
      </Box>
      <footer>
        <Footer />
      </footer>
    </Flex>
  );
}
