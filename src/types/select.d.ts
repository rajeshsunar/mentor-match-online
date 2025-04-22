
import { ComponentPropsWithoutRef } from "react";
import { SelectProps as RadixSelectProps } from "@radix-ui/react-select";

// Extend the RadixSelectProps to support multiple selection
declare module "@radix-ui/react-select" {
  interface SelectProps extends RadixSelectProps {
    multiple?: boolean;
    onValueChange?: (value: string | string[]) => void;
    defaultValue?: string | string[];
  }
}

// Export the extended type
export interface CustomSelectProps extends ComponentPropsWithoutRef<typeof import("@radix-ui/react-select").Root> {
  multiple?: boolean;
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
}
