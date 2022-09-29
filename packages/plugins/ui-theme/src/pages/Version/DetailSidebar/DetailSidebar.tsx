import styled from '@emotion/styled';
import React, { useContext } from 'react';
import { PackageMetaInterface } from 'types/packageMeta';
import ActionBar from 'verdaccio-ui/components/ActionBar';
import Author from 'verdaccio-ui/components/Author';
import Paper from 'verdaccio-ui/components/Paper';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { useConfig } from 'verdaccio-ui/providers/config';

import { DetailContext } from '..';
import loadable from '../../../App/utils/loadable';
import DetailSidebarFundButton from './DetailSidebarFundButton';
import DetailSidebarTitle from './DetailSidebarTitle';
import Developers from './Developers';
import { DeveloperType } from './Developers/DevelopersTitle';

const Engines = loadable(() => import(/* webpackChunkName: "Engines" */ './Engines'));
const Dist = loadable(() => import(/* webpackChunkName: "Dist" */ './Dist'));
const Install = loadable(() => import(/* webpackChunkName: "Install" */ './Install'));
const Repository = loadable(() => import(/* webpackChunkName: "Repository" */ './Repository'));

const getModuleType = (manifest: PackageMetaInterface) => {
  if (manifest.latest.main) {
    return 'commonjs';
  } else if (manifest.latest.type) {
    return manifest.latest.type;
  }
  return;
};

const DetailSidebar: React.FC = () => {
  const detailContext = useContext(DetailContext);
  const { packageMeta, packageName, packageVersion } = detailContext;
  const { configOptions } = useConfig();
  const version = packageVersion || packageMeta?.latest.version || '';
  const time = packageMeta?.time ? packageMeta.time[version] : '';

  if (!packageMeta || !packageName) {
    return null;
  }

  return (
    <StyledPaper className={'sidebar-info'}>
      <DetailSidebarTitle
        description={packageMeta.latest?.description}
        hasTypes={typeof packageMeta.latest.types === 'string'}
        isLatest={typeof packageVersion === 'undefined'}
        moduleType={getModuleType(packageMeta)}
        packageName={packageName}
        time={time}
        version={version}
      />
      <ActionBar
        showDownloadTarball={configOptions.showDownloadTarball}
        showRaw={configOptions.showRaw}
      />
      <Install />
      <DetailSidebarFundButton />
      <Repository />
      <Engines />
      <Dist />
      <Author />
      <Developers type={DeveloperType.MAINTAINERS} />
      <Developers type={DeveloperType.CONTRIBUTORS} />
    </StyledPaper>
  );
};

export default DetailSidebar;

const StyledPaper = styled(Paper)<{ theme?: Theme }>(({ theme }) => ({
  padding: theme?.spacing(3, 2),
}));
