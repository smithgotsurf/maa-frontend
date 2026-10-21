import { usePageTitle } from '../../utils';
import PageColumn from '../../components/PageColumn';
import Hero from './Hero';
import Intro from './Intro';
import ProgramsOffered from './ProgramsOffered';
import MoreOnTheSite from './MoreOnTheSite';
import GetInvolved from './GetInvolved';

export default function HomePage() {
  usePageTitle();
  return (
    <>
      <Hero />
      <PageColumn className="pt-6 pb-18">
        <Intro />
        <ProgramsOffered />
        <MoreOnTheSite />
        <GetInvolved />
      </PageColumn>
    </>
  );
}
