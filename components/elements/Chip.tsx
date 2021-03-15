type ChipProps = {
    label?: string;
    href?: string;
    skeleton?: boolean;
    key?: string;
};

export default function BookCard({
  label, href, key, skeleton = false,
}: ChipProps) {
  const classes = 'bg-gray-200 hover:bg-gray-300 border-3 border-red-600 inline-block rounded-full m-1 p-2 text-sm no-underline font-normal whitespace-nowrap';

  if (skeleton) {
    return (
      <span className={`${classes} animate-pulse h-3 w-24`} />
    );
  }
  if (href) {
    return (
      <a
        key={key}
        href={href}
        className={classes}
      >
        {label}
      </a>
    );
  }

  return (
    <span
      key={key}
      className={classes}
    >
      {label}
    </span>
  );
}
