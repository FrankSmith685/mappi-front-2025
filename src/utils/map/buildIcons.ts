/* eslint-disable @typescript-eslint/no-explicit-any */
type IconLike = {
  url: string;
  size?: any;
  scaledSize?: any;
  anchor?: any;
  origin?: any;
};

const createFallbackIcon = (url: string, width: number, height: number): IconLike => ({
  url,
  size: { width, height } as any,
  scaledSize: { width, height } as any,
  anchor: { x: Math.round(width / 2), y: height } as any,
  origin: { x: 0, y: 0 } as any,
});

export const buildMainIcon = (url: string, desired = { w: 90, h: 91 }): google.maps.Icon | IconLike => {
  const { w, h } = desired;

  if (typeof window === "undefined" || !window.google || !window.google.maps) {
    return createFallbackIcon(url, w, h);
  }

  return {
    url,
    size: new window.google.maps.Size(w, h),
    scaledSize: new window.google.maps.Size(w, h),
    anchor: new window.google.maps.Point(Math.round(w / 2), h),
    origin: new window.google.maps.Point(0, 0),
  };
};

export const buildServiceIcon = (url: string, selected: boolean, base = { w: 60, h: 60 }): google.maps.Icon | IconLike => {
  const size = selected ? { w: Math.round(base.w * 1.25), h: Math.round(base.h * 1.25) } : base;

  if (typeof window === "undefined" || !window.google || !window.google.maps) {
    return createFallbackIcon(url, size.w, size.h);
  }

  return {
    url,
    size: new window.google.maps.Size(size.w, size.h),
    scaledSize: new window.google.maps.Size(size.w, size.h),
    anchor: new window.google.maps.Point(Math.round(size.w / 2), size.h),
    origin: new window.google.maps.Point(0, 0),
  };
};
