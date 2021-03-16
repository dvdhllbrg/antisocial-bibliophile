import Link from 'next/link';

type ChipProps = {
    label?: string;
    href?: string;
    className?: string;
    skeleton?: boolean;
};

export default function Chip({
  label, href, className = '', skeleton = false,
}: ChipProps) {
  const classes = `bg-gray-200 hover:bg-gray-300 border-3 border-red-600 inline-block rounded-full m-1 first:ml-0 py-0.5 px-2 text-sm no-underline font-normal whitespace-nowrap ${className}`;

  if (skeleton) {
    return (
      <span className={`${classes} animate-pulse h-3 w-24`} />
    );
  }
  if (href) {
    return (
      <Link href={href}>
        <a className={classes}>{label}</a>
      </Link>
    );
  }

  return (
    <span className={classes}>{label}</span>
  );
}
