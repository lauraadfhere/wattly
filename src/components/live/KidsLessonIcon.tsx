type KidsLessonIconProps = {
  name: "star" | "rocket" | "bear" | "book" | "globe" | "chat";
  className?: string;
};

/** Small character / topic icons for live lesson cards. */
export default function KidsLessonIcon({ name, className = "h-6 w-6" }: KidsLessonIconProps) {
  switch (name) {
    case "star":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M12 2.5l2.4 6.8h7.1l-5.7 4.2 2.2 6.9L12 16.6 6 20.4l2.2-6.9L2.5 9.3h7.1L12 2.5z" />
          <circle cx="8.5" cy="9.5" r="0.9" fill="#fff" opacity="0.85" />
          <circle cx="15.5" cy="9.5" r="0.9" fill="#fff" opacity="0.85" />
        </svg>
      );
    case "rocket":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M12 2c2.5 2 4 5.2 4 9.2 0 1.4-.2 2.7-.5 3.8l2.2 2.2-1.4 1.4-2.1-2.1c-1 .5-2.1.9-3.2 1.1v2.9H11v-2.9a11 11 0 0 1-3.2-1.1l-2.1 2.1-1.4-1.4 2.2-2.2A12 12 0 0 1 6 11.2C6 7.2 7.5 4 12 2zm0 5.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      );
    case "bear":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <circle cx="7" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <ellipse cx="12" cy="13.5" rx="7.5" ry="6.5" />
          <circle cx="9.5" cy="12.5" r="1.1" fill="#fff" />
          <circle cx="14.5" cy="12.5" r="1.1" fill="#fff" />
          <ellipse cx="12" cy="15.2" rx="1.4" ry="1" fill="#fff" opacity="0.9" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16.5H6.5A2.5 2.5 0 0 0 4 21V4.5z" />
          <path d="M6.5 18.5A1.5 1.5 0 0 0 5 20h13.5V4H6.5a1.5 1.5 0 0 0 0 3H18v11.5H6.5z" fill="#fff" opacity="0.35" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.5 2.8 3.8 5.6 3.8 8.5S14.5 17.7 12 20.5C9.5 17.7 8.2 14.9 8.2 12S9.5 6.3 12 3.5z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          <circle cx="8.5" cy="10" r="1" fill="#fff" />
          <circle cx="12" cy="10" r="1" fill="#fff" />
          <circle cx="15.5" cy="10" r="1" fill="#fff" />
        </svg>
      );
    default:
      return null;
  }
}
