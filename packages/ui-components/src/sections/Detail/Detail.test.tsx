import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import DetailContainer from './Detail';

describe('DetailContainer', () => {
  test('renders correctly', () => {
    const { container } = render(<DetailContainer />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders without uplinks', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.showUplinks = false;
    render(<DetailContainer />);
    expect(screen.queryByTestId('uplinks-tab')).toBeFalsy();
  });

  test.todo('should test click on tabs');
});
