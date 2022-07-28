import { Box, BoxProps } from "@chakra-ui/react";

export default function Card({ children, ...rest }: BoxProps) {
  return (
    <Box
      p={4}
      boxShadow="md"
      borderRadius="lg"
      border="1px"
      borderColor="gray.100"
      {...rest}
    >
      {children}
    </Box>
  );
}
