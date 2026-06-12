import React from "react";

type AppImageProps = {
  src: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: "lazy" | "eager";
};

const AppImage: React.FC<AppImageProps> = ({
  src,
  alt = "",
  className = "",
  width,
  height,
  loading = "lazy",
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      width={width}
      height={height}
      loading={loading}
    />
  );
};

export default AppImage;
