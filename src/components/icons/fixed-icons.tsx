import { forwardRef, type SVGProps } from "react";

/** Paket @thesvg/react mengeluarkan path tanpa fill — warna diambil dari thesvg.org. */
export const GcpStackdriverIcon = forwardRef<
  SVGSVGElement,
  SVGProps<SVGSVGElement>
>(function GcpStackdriverIcon(props, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="#aecbfa"
        d="m11.19 11.35 4.56-7.84h-9l-4.5 7.84h8.94z"
      />
      <path
        fill="#4285f4"
        d="m2.25 12.65 4.49 7.84h8.99l-4.48-7.84h-9z"
      />
      <path fill="#669df6" d="m21.75 12-4.5-7.87L12.74 12l4.51 7.87Z" />
    </svg>
  );
});
