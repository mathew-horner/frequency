import {
  Modal as ChakraModal,
  ModalProps,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

export default function Modal({ children, ...rest }: ModalProps) {
  return (
    <ChakraModal {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        {children}
      </ModalContent>
    </ChakraModal>
  );
}
