import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, Award, Headphones, Watch, Laptop, Camera, Gamepad2 } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types';
import { ProductCard } from '../components/ProductCard';
import { Button, ResponsiveImage } from '@/components/ui';
import { useMetaTags } from '@/hooks/useMetaTags';
import { CATEGORIES } from '@/lib/constants';

const products = (productsData as unknown) as Product[];

const categoryIcons: Record<string, React.ReactNode> = {
  Headphones: <Headphones className="w-6 h-6" />,
  Watch: <Watch className="w-6 h-6" />,
  Laptop: <Laptop className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  Gamepad2: <Gamepad2 className="w-6 h-6" />,
};

export const HomePage: React.FC = () => {
  useMetaTags({
    title: 'AURA — Modern E-Commerce Catalog',
    description: 'Discover curated studio audio, titanium smartwatches, full-frame cameras, and gaming gear.',
  });

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const heroProduct = products[0];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/80 via-slate-900 to-indigo-950/70" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>NEXT-GEN AUDIO ARCHITECTURE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Acoustic Perfection.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-rose-400">
                Uncompromising Detail.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Introducing the AURA SoundMax Studio Pro. 40mm Beryllium drivers, 40-hour ANC endurance, and lossless spatial acoustic tuning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to={`/products/${heroProduct.slug}`}>
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Explore Hero Release
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800">
                  Browse Catalog
                </Button>
              </Link>
            </div>

            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="text-2xl font-black text-white">40h+</span>
                <p className="text-xs text-slate-400">ANC Battery</p>
              </div>
              <div>
                <span className="text-2xl font-black text-white">4.9★</span>
                <p className="text-xs text-slate-400">Audiophile Rating</p>
              </div>
              <div>
                <span className="text-2xl font-black text-white">0.01%</span>
                <p className="text-xs text-slate-400">Total Harmonic Distortion</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <ResponsiveImage
                image={heroProduct.images[0]}
                width={800}
                height={600}
                priority={true}
                alt={heroProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">{heroProduct.brand}</span>
                  <h2 className="text-lg font-bold text-white">{heroProduct.name}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Shop by Category
            </h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl hover:border-brand-500/40 hover:shadow-xl transition-all text-center flex flex-col items-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                {categoryIcons[cat.iconName]}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Flagship Releases
            </h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            Explore All 24 Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 text-white rounded-3xl border border-brand-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-500/20 rounded-2xl text-brand-300">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Ultra-Low Latency</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                State-of-the-art wireless protocols with under 15ms latency for pro gaming and live monitoring.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-500/20 rounded-2xl text-brand-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Aerospace Grade Materials</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Grade 5 titanium, beryllium drivers, and sapphire crystal built to endure extreme environments.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-500/20 rounded-2xl text-brand-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Audiophile Calibrated</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Individually tuned in anechoic chambers to match Harman target response curves precisely.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
