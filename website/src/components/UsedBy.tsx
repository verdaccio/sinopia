import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import React from 'react';

import Divider from './Divider';
import SponsorImage from './SponsorImage';
import styles from './UsedBy.module.scss';

const UsedBy = (): React.ReactElement => (
  <section className={styles.usedBy}>
    <div className={styles['usedBy--main']}>
      <b>
        <Translate>USED BY</Translate>
      </b>
      {[
        {
          name: 'SheetJs',
          image: useBaseUrl('/img/sponsors/sheetjs.png'),
          url: 'https://sheetjs.com/',
        },
        {
          name: 'GatsbyJs',
          image: useBaseUrl('/img/sponsors/gatsbysvg.svg'),
          url: 'https://www.gatsbyjs.com/',
        },
        {
          name: 'pnpm',
          image: useBaseUrl('/img/sponsors/pnpm.svg'),
          url: 'https://pnpm.io',
        },
        {
          name: 'create-react-app',
          image: useBaseUrl('/img/sponsors/react.svg'),
          url: ' https://create-react-app.dev/',
        },
        {
          name: 'Angular CLI',
          image: useBaseUrl('/img/sponsors/angular.svg'),
          url: 'https://angular.io/cli',
        },
        {
          name: 'vendure',
          image: useBaseUrl('/img/sponsors/vendure.png'),
          url: 'https://www.vendure.io/',
        },
        {
          name: 'aurelia',
          image: useBaseUrl('/img/sponsors/aurelia.svg'),
          url: 'https://aurelia.io/',
        },
        {
          name: 'Storybook',
          image: useBaseUrl('/img/sponsors/storybook.svg'),
          url: 'https://storybook.js.org/',
        },
      ].map((sponsor) => (
        <SponsorImage
          key={sponsor.name}
          name={sponsor.name}
          image={sponsor.image}
          url={sponsor.url}
        />
      ))}
    </div>
    <p className={styles['usedBy--footer']}>
      <Translate>And many more...</Translate>
    </p>
  </section>
);

export default UsedBy;
