/**
 * @prettier
 * @flow
 */
import { Icons } from './index';
import type { Styles } from '../../../../types';

export interface IIconsMap {
  brazil: string;
  spain: string;
  china: string;
  nicaragua: string;
  pakistan: string;
  austria: string;
  india: string;
  earth: string;
  verdaccio: string;
  license: string;
  time: string;
  law: string;
  version: string;
  filebinary: string;
  [key: string]: string;
}

export interface IProps {
  name: $Keys<typeof Icons>;
  className?: string;
  // $FlowFixMe
  onClick?: (event: SyntheticMouseEvent<SVGElement | HTMLSpanElement>) => void;
  size?: 'sm' | 'md';
  pointer?: boolean;
  img?: boolean;
  modifiers?: Styles;
}
