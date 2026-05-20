interface AvatarInitialsProps {
  name: string;
  className?: string;
}

export function AvatarInitials({ name, className = '' }: AvatarInitialsProps) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold ${className}`}
    >
      {initials}
    </div>
  );
}
