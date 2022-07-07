import { AiOutlinePlusCircle } from "react-icons/ai";
import Card from "./Card";

interface Props {
  onClick: () => void;
}

export function AddHabit({ onClick }: Props) {
  return (
    <button onClick={() => onClick()}>
      <Card
        display="flex"
        alignItems="center"
        justifyContent="center"
        textColor="white"
        backgroundColor="#61459c"
        h={16}
      >
        <AiOutlinePlusCircle size={30} />
      </Card>
    </button>
  );
}
