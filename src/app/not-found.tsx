import Image from "next/image";
import Link from "next/link";

/** Root fallback when locale segment is missing. */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[#000ea8] text-white antialiased">
        <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-6 py-20 sm:px-10">
          <Image
            src="/brand/wattly-logo-white.png"
            alt="Wattly"
            width={1000}
            height={280}
            className="mb-10 h-auto w-[160px]"
            priority
          />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ffc933]">
            404
          </p>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] font-medium leading-[1.05]">
            Page not found
          </h1>
          <p className="mt-5 max-w-[40ch] text-lg leading-8 text-[#c9d4ff]">
            This page does not exist or may have moved.
          </p>
          <Link
            href="/en"
            className="mt-10 inline-flex w-fit bg-[#ffc933] px-6 py-3.5 text-sm font-semibold text-[#0b0b1a]"
          >
            Back to home
          </Link>
        </main>
      </body>
    </html>
  );
}
