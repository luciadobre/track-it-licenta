const Checkbox = ({ className = "", ...props }) => (
  <input
    type="checkbox"
    className={`accent-accent h-4 w-4 ${className}`}
    {...props}
  />
);

export default Checkbox;
