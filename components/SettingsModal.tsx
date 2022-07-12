import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Formik } from "formik";
import { useContext } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { SettingsContext, SettingsSchema } from "../pages/_app";
import {
  formikOnSubmitHandler,
  toFormikValidationSchema,
} from "../utils/forms";
import Modal from "./Modal";

export default NiceModal.create(() => {
  const modal = useModal();
  const { settings, setSettings } = useContext(SettingsContext);
  return (
    <Modal isOpen={modal.visible} onClose={modal.remove} size="xl">
      <ModalHeader>
        <Flex alignItems="center" gap={1.5}>
          <IoSettingsSharp size={40} />
          <Text fontSize="3xl" fontWeight="bold">
            Settings
          </Text>
        </Flex>
      </ModalHeader>
      <Formik
        initialValues={settings}
        validationSchema={toFormikValidationSchema(SettingsSchema)}
        onSubmit={formikOnSubmitHandler((values) => {
          setSettings(values);
          modal.resolve();
          modal.remove();
          return Promise.resolve();
        })}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldError,
          setFieldValue,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormControl as="fieldset">
                  <FormLabel as="legend" fontWeight="bold">
                    View Mode
                  </FormLabel>
                  <RadioGroup
                    value={values.viewMode}
                    onChange={(v) => setFieldValue("viewMode", v)}
                  >
                    <HStack spacing="24px">
                      <Radio value="Standard">Standard</Radio>
                      <Radio value="Compact">Compact</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" disabled={isSubmitting} size="lg" mt={4}>
                  Submit
                </Button>
              </ModalFooter>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
});
