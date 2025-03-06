const Home = () => {
  return (
    <div className=" bg-pink-100 min-h-[100vh] px-4 md:px-10 xl:px-20">
      <div className=" flex gap-5 pt-10">
        <div
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?q=80&w=1929&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className=" bg-black/80 rounded-lg overflow-hidden text-white h-[300px] w-full text-5xl font-semibold "
        >
          <div className=" w-[100%] h-[300px] bg-black/60 grid place-content-center">
            Blood
          </div>
        </div>
        <div
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579208575657-c595a05383b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className=" bg-black/80 rounded-lg overflow-hidden text-white h-[300px] w-full text-5xl font-semibold "
        >
          <div className=" w-[100%] h-[300px] bg-black/60 grid place-content-center">
            Organs
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
