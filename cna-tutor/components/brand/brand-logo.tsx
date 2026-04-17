import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  width?: number;
};

export function BrandLogo({ className, priority = false, width = 320 }: BrandLogoProps) {
  return (
    <div className={className}>
      <Image
        alt="ACAM logo"
        className="h-auto w-full"
        height={95}
        priority={priority}
        src="/acam-logo.jpg"
        width={width}
      />
    </div>
  );
}

