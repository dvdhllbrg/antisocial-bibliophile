type SpinnerProps = {
  text?: string;
  width?: number;
  height?: number;
  className?: string;
};

const Spinner = ({
  text = "",
  width = 16,
  height = 16,
  className = "",
}: SpinnerProps) => (
  <div className="flex flex-col justify-center items-center">
    <div
      className={`animate-spin rounded-full h-${height} w-${width} border-t-2 border-b-2 border-gray-900 dark:border-white ${className}`}
    />
    {text}
  </div>
);

export default Spinner;
