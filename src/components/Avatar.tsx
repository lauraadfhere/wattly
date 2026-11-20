type AvatarProps = {
  name: string;
  role?: string;
  size?: "sm" | "md" | "lg";
};

const roleColors: Record<string, string> = {
  learner: "bg-[#0016BD]",
  parent: "bg-[#000A5E]",
  teacher: "bg-[#ff5c5c]",
  admin: "bg-[#0b0b1a]",
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "W";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function Avatar({ name, role, size = "md" }: AvatarProps) {
  const sizeClass =
    size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-16 w-16 text-xl" : "h-10 w-10 text-sm";
  const color = roleColors[role || ""] || "bg-[#0016BD]";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold text-white ${sizeClass} ${color}`}
      aria-hidden="true"
    >
      {initialsFromName(name)}
    </span>
  );
}
