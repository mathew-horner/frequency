
import { SessionProvider } from "next-auth/react";
import NiceModal from "@ebay/nice-modal-react";
import { ChakraProvider } from "@chakra-ui/react";

import SettingsContext from "../contexts/SettingsContext";

interface Props {
  children: React.ReactNode;
  session: any;
  settings: any; 
  theme: any;
}

function GlobalContext({ children, session, settings, theme }: Props) {
  return (
    <SessionProvider session={session}>
      <SettingsContext.Provider value={settings}>
        <ChakraProvider theme={theme}>
          <NiceModal.Provider>{children}</NiceModal.Provider>
        </ChakraProvider>
      </SettingsContext.Provider>
    </SessionProvider>
  );
}

export default GlobalContext;
