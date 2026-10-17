import { usePageTitle } from '../../utils';
import Hero from './Hero';
import Intro from './Intro';
import ProgramsOffered from './ProgramsOffered';
import MoreOnTheSite from './MoreOnTheSite';
import GetInvolved from './GetInvolved';

export default function HomePage() {
  usePageTitle();
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
