type SwitchProps = {
  on?: boolean;
  onToggle?: () => void;
  className?: string;
};

const Switch = ({ on, onToggle, className = "" }: SwitchProps) => (
  <div
    className={`relative rounded-full w-12 h-6 transition duration-200 ease-linear ${
      on ? "bg-primary dark:bg-dark-primary" : "bg-gray-200 dark:bg-gray-700"
    } ${className}`}
  >
    <label
      className={`absolute left-0 bg-white dark:bg-gray-900 border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer ${
        on
          ? "translate-x-full border-primary dark:border-dark-primary"
          : "translate-x-0 border-gray-200 dark:border-gray-700"
      }`}
    >
      <input
        type="checkbox"
        className="appearance-none w-full h-full active:outline-none focus:outline-none"
        onClick={onToggle}
      />
    </label>
  </div>
);

export default Switch;
