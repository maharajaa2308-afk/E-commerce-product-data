import React from 'react';
import { ProductImage } from '@/types';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  image: ProductImage;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  image,
  width = 400,
  height = 300,
  priority = false,
  sizes = '(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px',
  className = '',
  alt,
  ...props
}) => {
  const srcSet = `${image.thumbnail} 400w, ${image.medium} 800w, ${image.large} 1200w`;
  const imageAlt = alt || image.alt || 'Product image';

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={image.medium}
        srcSet={srcSet}
        sizes={sizes}
        alt={imageAlt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-expect-error - fetchpriority is supported in modern browsers
        fetchpriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={`object-cover w-full h-full transition-opacity duration-300 ${className}`}
        {...props}
      />
    </picture>
  );
};
