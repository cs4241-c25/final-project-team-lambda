"use client";

import { useState, useRef, useEffect } from "react";

export default function ValidatedNumberInput({
    name,
    min,
    max,
    step,
    defaultValue,
    placeholder,
    update
}: {
    name: string
    min?: number
    max?: number
    step?: number
    defaultValue: number
    placeholder?: string
    update: (value: number) => void
}) {
    const [ value, setValue ] = useState(defaultValue.toString());
    const input = useRef<HTMLInputElement>(null);

    function handleBlur() {
        let newValue = parseFloat(value);

        // validate value
        if (isNaN(newValue)) newValue = defaultValue;
        else if (min && newValue < min) newValue = min;
        else if (max && newValue > max) newValue = max;

        // update value
        setValue(newValue.toString());
        update(newValue);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.current) input.current.blur();
    };

    // update value when defaultValue changes
    useEffect(() => {
        setValue(defaultValue.toString());
    }, [defaultValue]);

    return (
        <input
            type="number"
            name={name}
            step={step}
            value={value}
            placeholder={placeholder}
            className="p-2 border border-[#9DA993] rounded min-w-20 w-full"
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            ref={input}
        />
    );
}