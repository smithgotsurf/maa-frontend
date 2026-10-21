import { Link } from 'react-router-dom';
import { PAGE_PATHS, usePageTitle } from '../../utils';
import PageColumn from '../../components/PageColumn';

export default function NotFoundPage() {
  usePageTitle('Page Not Found');
  return (
    <PageColumn>
      <h1 className="text-[30px] font-bold mb-1.5">Page Not Found</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-5">
        Sorry, we couldn't find the page you were looking for.
      </p>
      <Link to={PAGE_PATHS.home} className="btn btn-primary">
        Back to home
      </Link>
    </PageColumn>
  );
}
