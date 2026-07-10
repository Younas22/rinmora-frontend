"use client";

import { createRipple } from "@/lib/ripple";
import type { AnchorHTMLAttributes } from "react";

export default function RippleLink({
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`btn-ripple ${className}`} onClick={createRipple} {...props}>
      {children}
    </a>
  );
}
