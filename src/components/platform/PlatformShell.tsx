import DashboardShell from "@/components/platform/DashboardShell";

type PlatformShellProps = {
  title: string;
  intro?: string;
  children: React.ReactNode;
};

/** Shared app chrome — same header/template as the dashboard. */
export default function PlatformShell({
  title,
  intro,
  children,
}: PlatformShellProps) {
  return (
    <DashboardShell title={title} intro={intro}>
      {children}
    </DashboardShell>
  );
}
