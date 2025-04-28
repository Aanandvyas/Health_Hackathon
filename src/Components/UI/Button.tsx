type Props = {
  children: React.ReactNode;
  onClick?: () => void; // Make onClick optional
};

const Button = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="bg-primary transition hover:bg-[#158ace] px-8 py-1 shadow-lg rounded-3xl text-white"
    >
      {children}
    </button>
  );
};

export default Button;
