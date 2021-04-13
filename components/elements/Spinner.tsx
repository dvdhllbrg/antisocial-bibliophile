type SpinnerProps = {
  text?: string;
};

const Spinner = ({ text = '' }: SpinnerProps) => (
  <div className="flex flex-col justify-center items-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
    { text }
  </div>
);

export default Spinner;
