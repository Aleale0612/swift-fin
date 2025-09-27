import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
  className="h-full w-full flex-1 transition-all bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 bg-[length:200%_100%] animate-shimmer rounded-full shadow- animate-shimmer animate-pulseGlow[0_0_15px_rgba(56,189,248,0.8)]"
  style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
/>


  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
