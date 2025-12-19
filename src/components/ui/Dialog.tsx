"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type DialogProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Dialog = ({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
}: DialogProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <AnimatePresence>
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            />
          </DialogPrimitive.Overlay>
          <DialogPrimitive.Content asChild forceMount>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
              onClick={() => onOpenChange?.(false)}
            >
              <div
                className={clsx("card-surface max-w-xl w-full p-8 relative")}
                onClick={(e) => e.stopPropagation()}
              >
                <DialogPrimitive.Title className="text-h2 text-left">
                  {title}
                </DialogPrimitive.Title>
                {description ? (
                  <DialogPrimitive.Description className="mt-3 text-body">
                    {description}
                  </DialogPrimitive.Description>
                ) : null}
                <div className="mt-6">{children}</div>
                <DialogPrimitive.Close className="absolute right-4 top-4 text-em">
                  ×
                </DialogPrimitive.Close>
              </div>
            </motion.div>
          </DialogPrimitive.Content>
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

