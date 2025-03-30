const Footer = () => {
  return (
    <div className="bg-gray-800 text-gray-100 pt-16 pb-14">
      <div className="max-w-screen-lg mx-auto px-4 text-center">
        <div className="flex justify-center text-sm md:text-lg gap-4 md:gap-6 mb-5">
          <a href="/" className=" hover:text-blue-400 transition-colors">
            Home
          </a>
          <a
            href="/#mission"
            className=" hover:text-blue-400 transition-colors"
          >
            Mission
          </a>
          <a
            href="/blood-donar"
            className=" hover:text-blue-400 transition-colors"
          >
            Blood Donar
          </a>
          <a
            href="/organ-donar"
            className=" hover:text-blue-400 transition-colors"
          >
            Organ Donar
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
