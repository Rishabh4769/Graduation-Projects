import { useEffect, useMemo, useState } from 'react';

function buildFallbackUrls(query) {
  const encodedQuery = encodeURIComponent(`${query} india travel`);
  return [
    `https://source.unsplash.com/1600x900/?${encodedQuery}`,
    `https://source.unsplash.com/1200x800/?${encodedQuery}`,
  ];
}

function TravelImage({ src, alt, query, className, ...props }) {
  const fallbackUrls = useMemo(
    () => buildFallbackUrls(query || alt || 'india destination'),
    [alt, query],
  );
  const [imageSrc, setImageSrc] = useState(src || fallbackUrls[0]);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImageSrc(src || fallbackUrls[0]);
    setFallbackIndex(0);
    setFailed(false);
  }, [src, fallbackUrls]);

  const handleError = () => {
    if (fallbackIndex < fallbackUrls.length) {
      setImageSrc(fallbackUrls[fallbackIndex]);
      setFallbackIndex((current) => current + 1);
      return;
    }

    setFailed(true);
  };

  if (failed) {
    return (
      <div className={`${className || ''} image-fallback`} aria-label={alt} role="img">
        <span>{alt}</span>
      </div>
    );
  }

  return <img {...props} src={imageSrc} alt={alt} className={className} onError={handleError} />;
}

export default TravelImage;
