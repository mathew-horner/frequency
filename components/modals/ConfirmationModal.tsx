import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { ModalBody, ModalFooter, ModalHeader, Text } from "@chakra-ui/react";

import Button from "../Button";
import Modal from "../Modal";

interface Props {
  title: React.ReactNode | string;
  body: React.ReactNode | string;
}

export default NiceModal.create(({ title, body }: Props) => {
  const modal = useModal();

  return (
    <Modal isOpen={modal.visible} onClose={modal.remove} size="xl">
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <Text>{body}</Text>
      </ModalBody>
      <ModalFooter>
        <Button
          type_="red"
          onClick={() => {
            modal.resolve();
            modal.remove();
          }}
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
});
