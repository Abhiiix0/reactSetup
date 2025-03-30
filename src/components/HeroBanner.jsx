export default function HeroBanner() {
  return (
    <section
      className="relative w-full h-[calc(100vh-100px)] flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-green-100 to-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1644665009309-539346a3478e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-3xl mx-auto bg-white/60 p-6 rounded-lg">
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
