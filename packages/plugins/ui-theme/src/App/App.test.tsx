import React from 'react';
import { act, renderWithStore, screen } from 'verdaccio-ui/utils/test-react-testing-library';

import { store } from '@verdaccio/ui-components';

import App from './App';

// force the windows to expand to display items
// https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-640084107
jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

/* eslint-disable react/jsx-no-bind*/
describe('<App />', () => {
  describe('footer', () => {
    test('should display the Header component', async () => {
      await act(() => {
        renderWithStore(<App />, store);
      });
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('should not display the Header component', async () => {
      // @ts-ignore
      window.__VERDACCIO_BASENAME_UI_OPTIONS = {
        showFooter: false,
      };
      await act(() => {
        renderWithStore(<App />, store);
      });
      expect(screen.queryByTestId('footer')).toBeFalsy();
    });
  });
});
