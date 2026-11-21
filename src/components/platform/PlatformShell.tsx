import DashboardShell from "@/components/platform/DashboardShell";

type PlatformShellProps = {
  title: string;
  intro?: string;
  children: React.ReactNode;
  /** Default none — public marketing pages. Use auth/admin for private areas. */
  gate?: "auth" | "admin" | "none";
};

/** Shared app chrome — same header/template as the dashboard. */
export default function PlatformShell({
  title,
  intro,
  children,
  gate = "none",
}: PlatformShellProps) {
  return (
    <DashboardShell title={title} intro={intro} gate={gate}>
      {children}
    </DashboardShell>
  );
}
