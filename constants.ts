import { PageSizeOption, ImageCompressionOption, OrientationOption, ImagePositionOption } from './types';

export const PAGE_SIZES: PageSizeOption[] = [
  { value: 'a4', label: 'A4' },
  { value: 'letter', label: 'Letter' },
  { value: 'a3', label: 'A3' },
];

export const ORIENTATION_OPTIONS: OrientationOption[] = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
];

export const IMAGE_POSITION_OPTIONS: ImagePositionOption[] = [
  { value: 'fit', label: 'Fit', description: 'Keeps aspect ratio, fits image to page.' },
  { value: 'stretch', label: 'Stretch', description: 'Ignores aspect ratio, fills page.' },
];

export const IMAGE_COMPRESSION_OPTIONS: ImageCompressionOption[] = [
  { value: 0.5, label: 'High', description: 'Smallest file size, lower quality.' },
  { value: 0.75, label: 'Medium', description: 'Balanced size and quality.' },
  { value: 0.92, label: 'Low', description: 'Largest file size, best quality.' },
];