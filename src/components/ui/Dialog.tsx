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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
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
              <motion.div
                className={clsx("bg-[rgba(206,225,226,0.3)] border border-[rgb(206,225,226)] rounded-3xl max-w-xl w-full p-6 relative")}
                style={{ boxShadow: "inset 0 4px 50px 0 rgba(206,225,226,0.1)" }}
                initial={{ backdropFilter: "blur(0px)" }}
                animate={{ backdropFilter: "blur(24px)", transition: { duration: 1.0 } }}
                exit={{ backdropFilter: "blur(0px)", transition: { duration: 0.1 } }}
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
                <div>{children}</div>
              </motion.div>
            </motion.div>
          </DialogPrimitive.Content>
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

