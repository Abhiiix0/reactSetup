export default function HeroBanner() {
  return (
    <section className="relative w-full h-[calc(100vh-100px)] flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-green-100 to-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-green-600 leading-tight">
          Give Life, Share Hope
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-700">
          Donate blood and organs to save lives. Connect directly with those in
          need and make a lasting impact.
        </p>
      </div>
    </section>
  );
}
