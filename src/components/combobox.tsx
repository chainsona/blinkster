import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

interface ComboboxProps {
  items: { label: string; value: string }[];
  selected?: string;
  onSelect?: (value: string) => void;
}

export function Combobox({ items, selected, onSelect }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState("");

  function handleSelect(currentValue: string) {
    if (!onSelect) return;

    // setValue(currentValue === value ? "" : currentValue);
    onSelect(currentValue);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected
            ? items.find((item) => item.value === selected)?.label
            : "Select action..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Command>
          <CommandInput placeholder="Search action..." />
          <CommandList>
            <CommandEmpty>No action found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
