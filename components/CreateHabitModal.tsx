import {
  Button,
  Flex,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Formik } from "formik";
import { z } from "zod";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

import Modal from "./Modal";
import {
  formikOnSubmitHandler,
  toFormikValidationSchema,
} from "../utils/forms";
import { trpc } from "../utils/trpc";
import { getTodayTimestamp } from "../utils/date";

interface FormValues {
  title: string;
  frequency: number;
}

const FormSchema = z.object({
  title: z.string(),
  frequency: z.number().int(),
});

export default NiceModal.create(() => {
  const modal = useModal();
  const createHabit = trpc.useMutation("habit.create");
  const todayTimestamp = getTodayTimestamp();

  return (
    <Modal isOpen={modal.visible} onClose={modal.remove} size="xl">
      <ModalHeader>
        <Flex flexDirection="column" gap={3}>
          <Flex alignItems="center" gap={1.5}>
            <IoCheckmarkCircleSharp size={40} />
            <Text fontSize="3xl" fontWeight="bold">
              Create Habit
            </Text>
          </Flex>
          <Text color="gray" fontSize="sm" fontWeight="normal">
            This is the start of something great! Remember that doing a little
            bit every day is the key to long term success.
          </Text>
        </Flex>
      </ModalHeader>
      <Formik
        initialValues={{ title: "", frequency: 1 } as FormValues}
        validationSchema={toFormikValidationSchema(FormSchema)}
        onSubmit={formikOnSubmitHandler(({ title, frequency }) =>
          createHabit
            .mutateAsync({
              title,
              frequency,
              dateTimestamp: todayTimestamp,
            })
            .then(() => modal.resolve())
            .then(() => modal.remove())
        )}
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
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <Flex flexDirection="column" gap={6}>
                  <Flex flexDirection="column" gap={1.5}>
                    <Text as="label" fontWeight="medium" fontSize="lg">
                      What habit do you want to form?
                    </Text>
                    <Input
                      name="title"
                      value={values.title}
                      onChange={(e) => {
                        setFieldError("title", "");
                        handleChange(e);
                      }}
                      // TODO: Add error message
                      isInvalid={touched.title && !!errors.title}
                      size="lg"
                    />
                  </Flex>
                  <Flex flexDirection="column" gap={1.5}>
                    <Text as="label" fontWeight="medium" fontSize="lg">
                      Once per how many days?
                    </Text>
                    <NumberInput
                      name="frequency"
                      onChange={(e) => {
                        setFieldError("frequency", "");
                        handleChange(e);
                      }}
                      value={values.frequency}
                      isInvalid={touched.frequency && !!errors.frequency}
                      size="lg"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Flex>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button
                  backgroundColor="primaryBlue.100"
                  textColor="primaryBlue.500"
                  _hover={{
                    backgroundColor: "primaryBlue.300",
                  }}
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
