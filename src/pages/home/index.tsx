import { Link } from 'react-router-dom';
import { B_URL, PAGE_PATHS } from '../../utils';
import ContactSection from '../../components/ContactSection';
import { hero, intro, programsSection, getInvolved, teasers } from './copy';
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
      <h3 className="text-xl font-bold">{intro.heading}</h3>
      <p className="text-[17px] text-base-content/70 mt-1 leading-relaxed">{intro.body}</p>
    </div>
  );
}

function ProgramsOffered() {
  return (
    <section>
      <h2 className="text-[30px] font-bold mb-1.5">{programsSection.heading}</h2>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-3" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-5">
        {programsSection.subhead}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {programs.map((season) => (
          <div key={season.label}>
            <h3 className="text-xl font-bold text-center mb-3">{season.label}</h3>
            {season.items.map((i) => (
              <div
                className="card bg-white border border-primary rounded-[10px] p-4.5 mb-2"
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
    </section>
  );
}

function GetInvolved() {
  return (
    <section className="mt-12">
      <h2 className="text-[30px] font-bold mb-1.5">{getInvolved.heading}</h2>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-5">{getInvolved.body}</p>
      <ContactSection />
    </section>
  );
}

function MoreOnTheSite() {
  return (
    <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link
        to={PAGE_PATHS.fields}
        className="card bg-white border border-base-300 rounded-[10px] overflow-hidden no-underline text-base-content hover:opacity-90 transition-opacity"
      >
        <img
          src={B_URL + 'static/fields-aerial.jpg'}
          alt="MAA fields"
          className="w-full h-[140px] object-cover"
        />
        <div className="p-5">
          <h3 className="text-lg font-bold mb-1">{teasers.fields.heading}</h3>
          <p className="text-sm text-base-content/60 leading-relaxed mb-3">{teasers.fields.body}</p>
          <span className="text-sm font-semibold text-primary">{teasers.fields.cta} →</span>
        </div>
      </Link>

      <Link
        to={PAGE_PATHS.sponsors}
        className="card bg-white border border-base-300 rounded-[10px] overflow-hidden no-underline text-base-content hover:opacity-90 transition-opacity"
      >
        <img
          src={B_URL + 'static/sports-balls.jpg'}
          alt="Baseball, basketball, soccer ball, and volleyball"
          className="w-full h-[140px] object-contain bg-base-100"
        />
        <div className="p-5">
          <h3 className="text-lg font-bold mb-1">{teasers.sponsors.heading}</h3>
          <p className="text-sm text-base-content/60 leading-relaxed mb-3">
            {teasers.sponsors.body}
          </p>
          <span className="text-sm font-semibold text-primary">{teasers.sponsors.cta} →</span>
        </div>
      </Link>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Intro />
        <ProgramsOffered />
        <MoreOnTheSite />
        <GetInvolved />
      </div>
    </div>
  );
}
