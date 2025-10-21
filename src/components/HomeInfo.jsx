

const HomeInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <h1 className='sm:text-xl sm:leading-snug text-center py-4 px-8 text-slate-900 mx-5 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-black/10'>
        Hi, I'm
        <span className='font-semibold mx-2'>Chloe Le</span>
        👋
        <br />
        Full Stack Developer from Finland 🇫🇮
      </h1>
    );

  return null;
};

export default HomeInfo;
