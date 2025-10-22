import { Html, useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className='flex flex-col justify-center items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-md shadow-md border border-black/10'>
        <div className='w-10 h-10 border-2 border-opacity-20 border-blue-500 border-t-blue-500 rounded-full animate-spin'></div>
        <div className='text-sm font-medium text-slate-700'>Loading... {Math.round(progress)}%</div>
      </div>
    </Html>
  );
};

export default Loader;
