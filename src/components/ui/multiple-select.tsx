
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

const MultipleSelect = React.forwardRef<
  HTMLButtonElement,
  {
    multiple?: boolean;
    children: React.ReactNode;
    onValueChange: (value: string[]) => void;
    defaultValue?: string[];
    placeholder?: string;
    className?: string;
  }
>(({ multiple, children, onValueChange, defaultValue = [], placeholder, className, ...props }, ref) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);

  const handleValueChange = (value: string) => {
    let newValues;
    if (selectedValues.includes(value)) {
      newValues = selectedValues.filter(v => v !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    setSelectedValues(newValues);
    onValueChange(newValues);
  };

  return (
    <div className="relative">
      <SelectPrimitive.Root 
        {...props}
        onValueChange={(value) => handleValueChange(value)}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder}>
            {selectedValues.length > 0 
              ? `${selectedValues.length} selected` 
              : placeholder}
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
            position="popper"
            sideOffset={5}
          >
            <SelectPrimitive.Viewport className="p-1">
              {children}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
});

MultipleSelect.displayName = "MultipleSelect";

const MultipleSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, className, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

MultipleSelectItem.displayName = "MultipleSelectItem";

export { MultipleSelect, MultipleSelectItem };
