/* eslint-disable verdaccio/jsx-spread */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import Versions, { Props } from './Versions';
import data from './__partials__/data.json';
import dataDeprecated from './__partials__/deprecated-versions.json';
import dataUnsorted from './__partials__/unsorted-versions.json';

const VersionsComponent: React.FC<Props> = (props) => (
  <MemoryRouter>
    <Versions {...props} />
  </MemoryRouter>
);

vi.mock('lodash/debounce', () => ({
  default: vi.fn((fn) => {
    // Immediately execute the function for testing
    return (...args: any[]) => fn(...args);
  }),
}));
describe('<Version /> component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render versions', () => {
    const { getByText } = render(<VersionsComponent packageMeta={data} packageName={'foo'} />);

    expect(getByText('versions.version-history')).toBeTruthy();
    expect(getByText('versions.current-tags')).toBeTruthy();

    // pick some versions
    expect(getByText('2.3.0')).toBeTruthy();
    expect(getByText('canary')).toBeTruthy();
    // there is one deprecated version deprecated
    expect(screen.queryByTestId('deprecated-badge')).toBeInTheDocument();
  });

  test('should filter by version', () => {
    render(<VersionsComponent packageMeta={data} packageName={'foo'} />);
    expect(screen.getByText('versions.version-history')).toBeTruthy();
    expect(screen.getByText('versions.current-tags')).toBeTruthy();
    expect(screen.queryAllByTestId('version-list-text')).toHaveLength(65);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '2.3.0' } });
    expect(screen.queryAllByTestId('version-list-text')).toHaveLength(1);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
    expect(screen.queryAllByTestId('version-list-text')).toHaveLength(65);
  });

  test('should not render versions', () => {
    render(<VersionsComponent packageMeta={{}} packageName={'foo'} />);

    expect(screen.queryByText('versions.version-history')).toBeFalsy();
    expect(screen.queryByText('versions.current-tags')).toBeFalsy();
  });

  test('should render versions deprecated settings', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.hideDeprecatedVersions = true;
    const { getByText } = render(
      <VersionsComponent packageMeta={dataDeprecated} packageName={'foo'} />
    );
    expect(getByText('versions.hide-deprecated')).toBeTruthy();

    // pick some versions
    expect(screen.queryByText('0.0.2')).not.toBeInTheDocument();
    expect(screen.getByText('0.0.1')).toBeInTheDocument();
  });

  test('should render versions sorted by timestamp in descending order', () => {
    render(<VersionsComponent packageMeta={dataUnsorted} packageName={'dummy'} />);

    const versionElements = screen.getAllByTestId('version-list-link');
    const versions = versionElements.map((el) => el.textContent);

    // Expected order based on timestamps in unsorted-versions.json:
    expect(versions).toEqual(['1.0.1', '1.0.0', '0.1.1', '0.1.0']);
  });

  test.todo('should click on version link');
});
