import { Box, Button } from "@chakra-ui/react";
import { AiOutlinePlusCircle } from "react-icons/ai";

interface Props {
  onClick: () => void;
}

export function AddHabit({ onClick }: Props) {
  return (
    <Button h={12} onClick={() => onClick()}>
      <AiOutlinePlusCircle size={32} />
    </Button>
  );
}
