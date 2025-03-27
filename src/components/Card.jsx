/* eslint-disable react/prop-types */
const Card = ({ prd }) => {
  return (
    <div className=" bg-slate-200 w-fit overflow-hidden shadow hover:scale-[1.02] transition-all duration-200 ease-in-out cursor-pointer rounded-lg border">
      <img
        alt="mg"
        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className=" w-[300px] object-cover h-[300px]"
      />
      <div className=" flex flex-col gap-1 p-2 mt-1.5">
        <p>Abhishek Nayak</p>
        <p>
          Age : {prd?.age} | Blood Group : {prd?.bloodGroup}
        </p>
        <p>Phone Number : {prd?.contact}</p>
      </div>
    </div>
  );
};

export default Card;
