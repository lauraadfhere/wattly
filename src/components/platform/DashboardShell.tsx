import { Outfit } from "next/font/google";
import Footer from "@/components/Footer";
import AuthGate from "@/components/auth/AuthGate";
import DashboardHeader from "@/components/platform/DashboardHeader";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dashboard",
});

type DashboardShellProps = {
  title: string;
  intro?: string;
  children: React.ReactNode;
  /** auth = must be signed in; admin = admin only; none = public */
  gate?: "auth" | "admin" | "none";
};

export default function DashboardShell({
  title,
  intro,
  children,
  gate = "auth",
}: DashboardShellProps) {
  const body = (
    <>
      <h1 className="dashboard-title text-3xl font-semibold tracking-tight text-black sm:text-4xl">
        {title}
      </h1>
      {intro ? (
        <p className="mt-3 max-w-2xl text-base leading-7 text-black/70">{intro}</p>
      ) : null}
      <div className="mt-8">{children}</div>
    </>
  );

  return (
    <div
      className={`${outfit.variable} dashboard-shell flex min-h-dvh flex-1 flex-col bg-[#f4f4f5] text-black`}
    >
      <DashboardHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-28 pt-8 sm:px-10 md:pb-10">
        {gate === "none" ? body : <AuthGate mode={gate}>{body}</AuthGate>}
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
