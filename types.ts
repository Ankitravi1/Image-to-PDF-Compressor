export type PageSize = 'a4' | 'letter' | 'a3';
export type ImageCompression = number;
export type Orientation = 'portrait' | 'landscape';
export type ImagePosition = 'fit' | 'stretch';
export type ActiveTab = 'pdfConverter' | 'imageCompressor';

export interface PageSizeOption {
  value: PageSize;
  label: string;
}

export interface ImageCompressionOption {
  value: ImageCompression;
  label: string;
  description: string;
}

export interface OrientationOption {
  value: Orientation;
  label: string;
}

export interface ImagePositionOption {
  value: ImagePosition;
  label: string;
  description: string;
}
