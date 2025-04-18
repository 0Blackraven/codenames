import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";

export default function NumberComboBox({ onChange }) {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const numbers = Array.from({ length: 4 }, (_, i) => i + 1);

  const handleSelect = (num) => {
    setSelectedNumber(num);
    if (onChange) onChange(num);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-12 px-2 text-center">
          {selectedNumber ?? ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex gap-2 p-2 w-42 bg-opacity-50">
        {numbers.map((num) => (
          <Button
            key={num}
            variant="ghost"
            size="sm"
            className="w-8 h-8 flex items-center justify-center text-green-500"
            onClick={() => handleSelect(num)}
          >
            {num}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
