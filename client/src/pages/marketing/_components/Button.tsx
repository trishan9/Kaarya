import React from "react";

const baseStyles = {
  solid:
    "group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
  outline:
    "group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none",
};

const variantStyles = {
  solid: {
    slate:
      "bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900",
    blue: "bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600",
    white:
      "bg-white text-slate-900 hover:bg-blue-50 active:bg-blue-200 active:text-slate-600 focus-visible:outline-white",
    default:
      "bg-primaryGreen text-white hover:bg-primaryGreenHover hover:text-slate-100",
  },
  outline: {
    slate:
      "ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300",
    white:
      "ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white",
  },
};

type VariantKey = keyof typeof variantStyles;
type ColorKey<Variant extends VariantKey> =
  keyof (typeof variantStyles)[Variant];

type ButtonProps<
  Variant extends VariantKey,
  Color extends ColorKey<Variant>,
> = {
  variant?: Variant;
  color?: Color;
  className?: string;
} & (
  | Omit<React.ComponentPropsWithoutRef<"a">, "color">
  | (Omit<React.ComponentPropsWithoutRef<"button">, "color"> & {
      href?: undefined;
    })
);

const Button = <
  Color extends ColorKey<Variant>,
  Variant extends VariantKey = "solid",
>({
  variant = "solid" as Variant,
  color = "slate" as Color,
  className = "",
  ...props
}: ButtonProps<Variant, Color>) => {
  const combinedClassName = [
    baseStyles[variant],
    variantStyles[variant][color],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return typeof props.href === "undefined" ? (
    <Button className={combinedClassName} {...props} />
  ) : (
    <a className={combinedClassName} {...props} />
  );
};

export default Button;
