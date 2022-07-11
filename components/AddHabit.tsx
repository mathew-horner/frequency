import { Box } from "@chakra-ui/react";
import { AiOutlinePlusCircle } from "react-icons/ai";

interface Props {
  onClick: () => void;
}

export function AddHabit({ onClick }: Props) {
  return (
    <button onClick={() => onClick()}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        textColor="primaryBlue.500"
        backgroundColor="primaryBlue.100"
        h={16}
        borderRadius="xl"
      >
        <AiOutlinePlusCircle size={30} />
      </Box>
    </button>
  );
}
