import * as React from "react"
import { useState, createContext, useContext } from 'react';
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const SelectContext = createContext({ value: '', onValueChange: () => { }, open: false, setOpen: () => { } });

const SelectROOT = ({ value, onValueChange, children }) => {
    const [open, setOpen] = useState(false);
    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
};

const SelectTriggerImpl = ({ className, children }) => {
    const { open, setOpen, value } = useContext(SelectContext);
    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-12 w-full items-center justify-between rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50"><path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </button>
    );
};

const SelectContentImpl = ({ className, children }) => {
    const { open } = useContext(SelectContext);
    if (!open) return null;
    return (
        <div className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md animate-in fade-in-80 w-full mt-1",
            className
        )}>
            <div className="w-full p-1 max-h-[200px] overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

const SelectItem = ({ value: itemValue, children, className }) => {
    const { onValueChange, setOpen } = useContext(SelectContext);
    return (
        <div
            onClick={() => {
                onValueChange(itemValue);
                setOpen(false);
            }}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-slate-100 hover:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
                className
            )}
        >
            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
            </span>
            <span className="truncate text-gray-700">{children}</span>
        </div>
    );
};

const SelectValueImpl = ({ placeholder }) => {
    const { value } = useContext(SelectContext);
    return <span>{value || placeholder}</span>;
}

export { SelectROOT as Select, SelectTriggerImpl as SelectTrigger, SelectContentImpl as SelectContent, SelectItem, SelectValueImpl as SelectValue }
