import * as React from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
        default: "bg-teal-600 text-white shadow-lg shadow-teal-500/20 hover:bg-teal-700 hover:-translate-y-0.5 active:translate-y-0",
        primary: "bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0",
        outline: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900",
        ghost: "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
        success: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700",
    }

    const sizes = {
        default: "h-11 px-6 py-2 content-center",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10",
    }

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
