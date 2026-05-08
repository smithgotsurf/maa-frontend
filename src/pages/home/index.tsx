import { hero, intro, programsSection, outro } from './copy';
import { programs } from './programs';

function Hero() {
  return (
    <div
      className="relative bg-cover bg-center text-white text-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${hero.backgroundImage}')`,
        padding: '64px 28px 180px',
      }}
    >
      <h1 className="text-3xl md:text-[42px] font-bold leading-tight mb-1.5">
        <span className="text-primary">M</span>eadow <span className="text-primary">A</span>
        thletic <span className="text-primary">A</span>ssociation
      </h1>
      <p className="text-base opacity-55 max-w-[440px] mx-auto mb-8 leading-relaxed">
        {hero.subhead}
      </p>
    </div>
  );
}

function Intro() {
  return (
    <div className="card bg-white shadow-[0_3px_20px_rgba(0,0,0,.05)] border border-base-300 rounded-xl p-5 -mt-34 max-w-[600px] mx-auto relative z-10 mb-10">
      <h3 className="text-[17px] font-bold">{intro.heading}</h3>
      <p className="text-[13px] text-base-content/50 mt-0.5 leading-relaxed">{intro.body}</p>
    </div>
  );
}

function ProgramsOffered() {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-[20px] font-bold">{programsSection.heading}</h3>
        <p className="text-[13px] text-base-content/50">{programsSection.subhead}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {programs.map((season) => (
          <div key={season.label}>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-base-content/50 text-center mb-2">
              {season.label}
            </div>
            {season.items.map((i) => (
              <div
                className="card bg-white border border-base-300 rounded-[10px] p-4.5 mb-2"
                key={i.name}
              >
                <h4 className="font-serif font-semibold text-base">{i.name}</h4>
                <ul className="flex flex-wrap gap-1 mt-1">
                  {i.ages.map((a) => (
                    <li key={a} className="badge badge-ghost badge-sm">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function Outro() {
  return (
    <div className="mt-10 mb-4 text-center">
      <h3 className="text-[20px] font-bold mb-1">{outro.heading}</h3>
      <p className="text-[14px] text-base-content/60 leading-relaxed max-w-[600px] mx-auto">
        {outro.body}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Intro />
        <ProgramsOffered />
        <Outro />
      </div>
    </div>
  );
}
