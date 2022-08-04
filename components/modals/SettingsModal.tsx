import {
  Button,
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
import z from "zod";

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

  const settings = userSettingsGet.data;

  if (!settings) return null;

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
                          value ? parseInt(value) : undefined
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
              </ModalBody>

              {/* Submit Button */}
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
