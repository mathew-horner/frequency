import React, { useContext } from "react";
import { UserSettings } from "@prisma/client";
import NiceModal from "@ebay/nice-modal-react";
import { ChakraProvider } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  settings: UserSettings;
  theme: any;
}

interface GlobalContextType {
  settings: UserSettings;
}

const GlobalContextProvider = React.createContext<GlobalContextType | null>(
  null
);

function GlobalContext({ children, settings, theme }: Props) {
  return (
    <ChakraProvider theme={theme}>
      <GlobalContextProvider.Provider value={{ settings }}>
        <NiceModal.Provider>{children}</NiceModal.Provider>
      </GlobalContextProvider.Provider>
    </ChakraProvider>
  );
}

export function useGlobalContext() {
  const global = useContext(GlobalContextProvider);

  // This should not be null if we are calling it in the component tree,
  // as we should not render if we are unable to create the global context.
  return global as GlobalContextType;
}

export default GlobalContext;
