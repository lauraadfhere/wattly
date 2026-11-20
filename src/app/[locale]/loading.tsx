import Image from "next/image";

export default function LocaleLoading() {
  return (
    <div
      className="flex min-h-dvh flex-1 items-center justify-center bg-[#000ea8]"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/favicon.png"
          alt=""
          width={72}
          height={72}
          className="h-16 w-16 animate-pulse rounded-2xl"
          priority
        />
        <span className="h-1.5 w-28 overflow-hidden rounded-full bg-white/20">
          <span className="app-loader-bar block h-full w-1/2 rounded-full bg-[#ffc933]" />
        </span>
      </div>
    </div>
  );
}
