import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  InputRightAddon,
  InputGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Formik } from "formik";
import { IoSettingsSharp } from "react-icons/io5";
import { signOut } from "next-auth/react";
import z from "zod";

import Button from "../Button";
import Card from "../Card";
import ConfirmationModal from "./ConfirmationModal";
import Modal from "../Modal";
import { trpc } from "../../utils/trpc";

import {
  formikOnSubmitHandler,
  toFormikValidationSchema,
} from "../../utils/forms";

export default NiceModal.create(() => {
  const modal = useModal();

  const userSettingsGet = trpc.useQuery(["settings.get"]);
  const userSettingsUpdate = trpc.useMutation("settings.update");
  const userDelete = trpc.useMutation("user.delete");

  const settings = userSettingsGet.data;

  if (!settings) return null;

  function handleDeleteAccount() {
    NiceModal.show(ConfirmationModal, {
      title: "Delete Account?",
      body: "Are you sure you want to delete your account? This action will result in a permanent loss of data.",
    }).then(async () => {
      await userDelete.mutateAsync();
      signOut();
      modal.remove();
    });
  }

  return (
    <Modal isOpen={modal.visible} onClose={modal.remove} size="xl">
      <ModalHeader>
        {/* Modal Title */}
        <Flex alignItems="center" gap={1.5}>
          <IoSettingsSharp size={40} />
          <Text fontSize="3xl" fontWeight="bold">
            Settings
          </Text>
        </Flex>
      </ModalHeader>

      <Formik
        initialValues={settings}
        // TODO: Find a way to share this schema with the definition in the tRPC router.
        validationSchema={toFormikValidationSchema(
          z.object({
            viewMode: z.enum(["Standard", "Compact"]),
            hiddenHabitDueInThreshold: z.number().int().nullish(),
          })
        )}
        onSubmit={formikOnSubmitHandler(async (values) => {
          await userSettingsUpdate.mutateAsync({
            ...values,
          });

          modal.resolve();
          modal.remove();
          return Promise.resolve();
        })}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({
          values,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldError,
          touched,
          errors,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <ModalBody display="flex" flexDirection="column" gap={6}>
                {/* View Mode */}
                <FormControl as="fieldset">
                  <FormLabel as="legend" fontWeight="medium" fontSize="lg">
                    View Mode
                  </FormLabel>
                  <RadioGroup
                    value={values.viewMode}
                    onChange={(v) => setFieldValue("viewMode", v)}
                    size="lg"
                  >
                    <HStack spacing="24px">
                      <Radio value="Standard">Standard</Radio>
                      <Radio value="Compact">Compact</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>

                {/* Hidden Habit Due Date Threshold */}
                <Flex flexDirection="column" gap={1.5}>
                  <Text as="label" fontWeight="medium" fontSize="lg">
                    Hide habits due in more than
                  </Text>
                  <InputGroup display="flex" size="lg">
                    <NumberInput
                      flexGrow={1}
                      onChange={(value) => {
                        setFieldError("hiddenHabitDueInThreshold", "");
                        setFieldValue(
                          "hiddenHabitDueInThreshold",
                          value ? parseInt(value) : null
                        );
                      }}
                      value={values.hiddenHabitDueInThreshold || ""}
                      isInvalid={
                        touched.hiddenHabitDueInThreshold &&
                        !!errors.hiddenHabitDueInThreshold
                      }
                      min={0}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <InputRightAddon>day(s)</InputRightAddon>
                  </InputGroup>
                </Flex>

                {/* Danger Zone */}
                <Card p={0}>
                  <Accordion border="none" allowToggle>
                    <AccordionItem border="none">
                      <AccordionButton>
                        <Box flexGrow={1} textAlign="left">
                          Account Controls
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        <Button
                          type_="red"
                          onClick={() => handleDeleteAccount()}
                        >
                          Delete Account
                        </Button>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </ModalBody>

              {/* Submit Button */}
              <ModalFooter>
                <Button
                  type_="gray"
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  mt={4}
                >
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
