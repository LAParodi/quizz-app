const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-1/2 px-12 pt-8 pb-12">
        <h2 className="text-xl font-bold text-black select-none">Quizzy</h2>
        {children}
      </div>

      <div className="hidden md:block w-1/2 h-screen bg-pattern"></div>
    </div>
  );
};

export default AuthLayout;
