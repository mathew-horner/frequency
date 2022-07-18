import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";

type ButtonType = "black" | "gray" | "white" | "white-outline";

interface Props extends ChakraButtonProps {
  type_?: ButtonType;
}

export default function Button({ type_, children, ...rest }: Props) {
  const props: any = {};

  if (type_ === "black") {
    props.backgroundColor = "black";
    props.textColor = "white";
    props._hover = {
      backgroundColor: "gray.700",
    };
  }

  if (type_ === "white") {
    props.backgroundColor = "white";
    props.textColor = "black";
  }

  if (type_ === "white-outline") {
    props.border = "1px";
    props.borderColor = "white";
    props.backgroundColor = "transparent";
    props.textColor = "white";
    props._hover = {
      backgroundColor: "gray.700",
    }
  }

  return (
    <ChakraButton {...rest} {...props}>
      {children}
    </ChakraButton>
  );
}
