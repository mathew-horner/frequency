import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";

type ButtonType =
  | "black"
  | "gray"
  | "red"
  | "transparent"
  | "white"
  | "white-outline";

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

  if (type_ === "red") {
    props.backgroundColor = "red.400";
    props.textColor = "white";
    props._hover = {
      backgroundColor: "red.500",
    };
  }

  if (type_ == "transparent") {
    props.backgroundColor = "transparent";
    props.height = "auto";
    props.px = 0;
    props.py = 0;
    props.textColor = "gray.500";
    props._hover = {
      backgroundColor: "transparent",
      textColor: "black",
    };
    props._active = {
      backgroundColor: "transparent",
    }
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
    };
  }

  return (
    <ChakraButton {...props} {...rest} >
      {children}
    </ChakraButton>
  );
}
