import {
  Flex,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
import { AiFillEdit } from "react-icons/ai";

import Button from "../Button";
import Modal from "../Modal";
import { TrpcHabitListItem } from "../../utils/types";
import {
  formikOnSubmitHandler,
  toFormikValidationSchema,
} from "../../utils/forms";
import { trpc } from "../../utils/trpc";

/** The shape of the form state. */
interface FormValues {
  title: string;
  frequency: number;
}

/** Schema used to validate the form input. */
const FormSchema = z.object({
  title: z.string(),
  frequency: z.number().int(),
});

interface Props {
  habit: TrpcHabitListItem;
}

export default NiceModal.create(({ habit }: Props) => {
  const modal = useModal();
  const deleteHabit = trpc.useMutation("habit.delete");
  const editHabit = trpc.useMutation("habit.edit");

  function handleDelete() {
    deleteHabit
      .mutateAsync({
        habitId: habit.id,
      })
      .then(() => modal.resolve())
      .then(() => modal.remove());
  }

  return (
    <Modal isOpen={modal.visible} onClose={modal.remove} size="xl">
      <ModalHeader>
        <Flex flexDirection="column" gap={3}>
          {/* Modal Title */}
          <Flex alignItems="center" gap={1.5}>
            <AiFillEdit size={40} />
            <Text fontSize="3xl" fontWeight="bold">
              Edit Habit
            </Text>
          </Flex>
        </Flex>
      </ModalHeader>

      <Formik
        initialValues={
          { title: habit.title, frequency: habit.frequency } as FormValues
        }
        validationSchema={toFormikValidationSchema(FormSchema)}
        onSubmit={formikOnSubmitHandler(({ title, frequency }) =>
          editHabit
            .mutateAsync({
              habitId: habit.id,
              title,
              frequency,
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
          setFieldValue,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <Flex flexDirection="column" gap={6}>
                  {/* Habit Title */}
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
                      autoFocus
                    />
                  </Flex>

                  {/* Habit Frequency */}
                  <Flex flexDirection="column" gap={1.5}>
                    <Text as="label" fontWeight="medium" fontSize="lg">
                      Once per how many days?
                    </Text>
                    <NumberInput
                      name="frequency"
                      onChange={(value) => {
                        setFieldError("frequency", "");
                        setFieldValue(
                          "frequency",
                          value ? parseInt(value) : ""
                        );
                      }}
                      value={values.frequency}
                      isInvalid={touched.frequency && !!errors.frequency}
                      size="lg"
                      min={1}
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

              {/* Buttons */}
              <ModalFooter>
                <Flex mt={4} gap={4}>
                  <Button
                    type_="red"
                    disabled={isSubmitting}
                    size="lg"
                    w={28}
                    onClick={() => handleDelete()}
                  >
                    Delete
                  </Button>
                  <Button
                    type_="gray"
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    w={28}
                  >
                    Save
                  </Button>
                </Flex>
              </ModalFooter>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
});
