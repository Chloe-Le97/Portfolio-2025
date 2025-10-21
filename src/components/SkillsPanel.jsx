import { skills } from "../constants";

const SkillsPanel = () => {
  return (
    <section className='max-container'>
      <h3 className='subhead-text'>My Skills</h3>
      <div className='mt-6 flex flex-wrap gap-6'>
        {skills.map((skill) => (
          <div className='block-container w-20 h-20' key={skill.name}>
            <div className='btn-back rounded-xl' />
            <div className='btn-front rounded-xl flex justify-center items-center'>
              <img
                src={skill.imageUrl}
                alt={skill.name}
                className='w-1/2 h-1/2 object-contain'
                title={skill.name}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsPanel;


