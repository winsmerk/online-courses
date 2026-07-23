import Image from "next/image";

export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <span className="brand-logo-frame">
      <Image
        src="/beyond-wild-logo.jpg"
        alt=""
        fill
        priority={priority}
        sizes="180px"
      />
    </span>
  );
}
