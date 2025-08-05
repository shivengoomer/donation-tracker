"use client";
const FloatingNav = () => {

  return (
    <div
      className=
        "fixed top-10 inset-x-0 mx-auto z-50 max-w-max flex items-center gap-10 justify-center px-10 py-2 space-x-4 bg-black/90 text-white rounded-full border border-white shadow-lg transition-all duration-300 text-4xl backdrop-blur-3xl"
    >
      <a
        href="/track"
        className="text-lg hover:text-gray-600"
      >
        Track
      </a>
      <a href="/login">
      <button className="relative text-lg font-medium px-4 py-1.5 rounded-full  hover:text-gray-600">
        Login
        <span className="absolute bottom-0 left-1/2 w-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-black to-transparent" />
      </button>
      </a>
    </div>
  );
};

export default FloatingNav;
