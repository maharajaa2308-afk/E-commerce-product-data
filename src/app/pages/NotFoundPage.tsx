import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui';
import { useMetaTags } from '@/hooks/useMetaTags';

export const NotFoundPage: React.FC = () => {
  useMetaTags({
    title: '404 Page Not Found',
    description: 'The requested page could not be found.',
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <div>
          <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            Error 404
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            The page or product URL you requested does not exist or has been moved to a new route.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
              Go to Home
            </Button>
          </Link>
          <Link to="/products" className="w-full">
            <Button variant="primary" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Explore Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
