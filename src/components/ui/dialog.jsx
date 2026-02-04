import * as React from "react"
import { X } from "lucide-react"

const DialogContext = React.createContext({
    open: false,
    onOpenChange: () => { }
})

const Dialog = ({ children, open, onOpenChange }) => {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </DialogContext.Provider>
    )
}

const DialogTrigger = ({ children, asChild, ...props }) => {
    const { onOpenChange } = React.useContext(DialogContext)

    if (asChild) {
        return React.cloneElement(children, {
            ...props,
            onClick: (e) => {
                if (children.props.onClick) children.props.onClick(e)
                onOpenChange(true)
            }
        })
    }

    return (
        <button type="button" onClick={() => onOpenChange(true)} {...props}>
            {children}
        </button>
    )
}

const DialogContent = ({ children, className }) => {
    const { open, onOpenChange } = React.useContext(DialogContext)

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => onOpenChange(false)}
            />
            <div className={`relative z-50 shadow-2xl animate-in zoom-in-95 duration-200 ${className || ''}`}>
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-6 top-6 p-2 rounded-xl hover:bg-white/10 transition-colors z-50 text-slate-500 hover:text-slate-400"
                >
                    <X className="w-5 h-5" />
                </button>
                {children}
            </div>
        </div>
    )
}

const DialogHeader = ({ children, className }) => {
    return <div className={`mb-6 ${className || ''}`}>{children}</div>
}

const DialogTitle = ({ children, className }) => {
    return <h2 className={`text-2xl font-black ${className || ''}`}>{children}</h2>
}

const DialogFooter = ({ children, className }) => {
    return <div className={`mt-8 flex justify-end gap-3 ${className || ''}`}>{children}</div>
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter }
