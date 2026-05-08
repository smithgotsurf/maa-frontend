import { Ic, icons } from '../../utils';
import { board } from './board';
import { intro, boardLead, contactEmail, facebookUrl } from './copy';

export default function AboutPage() {
  const officers = board.filter((m) => m.role);
  const members = board.filter((m) => !m.role);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">About the Meadow Athletic Association</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">{intro}</p>
      <h2 className="text-xl font-bold mb-2">Our Board</h2>
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-3">{boardLead}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 mb-8">
        {officers.map((o) => (
          <div
            className="card bg-white border border-secondary rounded-[9px] p-4.5 text-center"
            key={o.name}
          >
            <div className="w-12 h-12 rounded-full bg-[#FBF7EC] flex items-center justify-center mx-auto mb-2 text-primary">
              <Ic d={icons.user} s={22} />
            </div>
            <h4 className="text-sm font-semibold">{o.name}</h4>
            <p className="text-[11px] text-base-content/50">{o.role}</p>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-2">Members</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2.5 mb-8">
        {members.map((m) => (
          <span
            key={m.name}
            className="text-[13px] text-base-content/70 bg-base-100 border border-base-300 py-1.5 px-1 rounded-[5px] text-center"
          >
            {m.name}
          </span>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-4">Contact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="card bg-white border border-base-300 rounded-[10px] p-5">
          <h3 className="text-base font-bold mb-1">Get in Touch</h3>
          <p className="flex items-center gap-1.5 text-sm text-base-content/50">
            <Ic d={icons.mail} s={14} />
            {contactEmail}
          </p>
        </div>
        <div className="card bg-white border border-base-300 rounded-[10px] p-5">
          <h3 className="text-base font-bold mb-1">Follow Us</h3>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#1877F2] font-semibold text-sm no-underline"
          >
            <Ic d={icons.fb} s={16} />
            Join us on Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
