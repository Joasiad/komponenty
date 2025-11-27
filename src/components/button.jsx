const Button = ({ onClick, className = "", children, type = "button" }) => {
  return (
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      {children}
    </button>
  );
};

export default Button;
