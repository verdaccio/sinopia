/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import colors from '../../utils/styles/colors';
import { fontSize } from '../../utils/styles/sizes';

export const Title = styled(DialogTitle)`
  && {
    background-color: ${colors.primary};
    color: ${colors.white};
    font-size: ${fontSize.lg};
  }
`;
