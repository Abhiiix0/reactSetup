const Footer = () => {
  return (
    <div className="bg-gray-800 text-gray-100 pt-16 pb-14">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <div className="flex justify-center text-sm md:text-lg gap-4 md:gap-6 mb-5">
          <a href="#home" className=" hover:text-blue-400 transition-colors">
            Home
          </a>
          <a href="#about" className=" hover:text-blue-400 transition-colors">
            About
          </a>
          <a
            href="#blood-donation"
            className=" hover:text-blue-400 transition-colors"
          >
            Blood Donation
          </a>
          <a
            href="#organ-donation"
            className=" hover:text-blue-400 transition-colors"
          >
            Organ Donation
          </a>
        </div>
        <p className="text-sm text-gray-400">
          © 2025 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
