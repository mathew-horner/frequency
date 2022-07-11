import { Button } from "@chakra-ui/react";
import { IoAddCircleOutline } from "react-icons/io5";

interface Props {
  onClick: () => void;
}

export function AddHabit({ onClick }: Props) {
  return (
    <Button h={12} onClick={() => onClick()}>
      <IoAddCircleOutline size={32} />
    </Button>
  );
}
