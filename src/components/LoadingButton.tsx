'use client'
import {Loader2} from 'lucide-react'
import React from 'react'
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import string from "zod/src/v3/benchmarks/string";

// interface LoadingButtonProps extends ButtonProps {
//   loading: boolean;
// }
interface LoadingButtonProps {
    loading: boolean,
    disabled: boolean,
    className?: string,
    type?: string,
    children: React.ReactNode,
    onClick?: () => Promise<void>
}

const LoadingButton = ({
                           loading,
                           disabled,
                           className,
                           type,
                           ...props,
                           onClick
                       }: LoadingButtonProps) => {
    return (
        <Button
            disabled={loading || disabled}
            className={cn('flex items-center gap-2', className)}
            {...props}
        >
            {loading && <Loader2 className="size-5 animate-spin"/>}
            {props.children}
        </Button>
    )
}

export default LoadingButton
