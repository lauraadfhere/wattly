import Image from "next/image";

export default function LocaleLoading() {
  return (
    <div
      className="flex min-h-dvh flex-1 items-center justify-center bg-transparent"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <Image
        src="/favicon.png"
        alt=""
        width={56}
        height={56}
        className="h-12 w-12 animate-pulse rounded-xl"
        priority
      />
    </div>
  );
}
