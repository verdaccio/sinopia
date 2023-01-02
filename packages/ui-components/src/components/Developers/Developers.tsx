import styled from '@emotion/styled';
import Add from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FabMUI from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Theme } from '../../Theme';
import Title from './Title';
import getUniqueDeveloperValues from './get-unique-developer-values';

export enum DeveloperType {
  CONTRIBUTORS = 'contributors',
  MAINTAINERS = 'maintainers',
}

export const Fab = styled(FabMUI)<{ theme?: Theme }>((props) => ({
  backgroundColor: props.theme?.palette.primary.main,
  color: props.theme?.palette.white,
}));

interface Props {
  type: DeveloperType;
  visibleMax?: number;
  packageMeta: any;
}

const StyledBox = styled(Box)({
  '> *': {
    margin: 5,
  },
});

export const VISIBLE_MAX = 6;

const Developers: React.FC<Props> = ({ type, visibleMax = VISIBLE_MAX, packageMeta }) => {
  const developers = useMemo(
    () => getUniqueDeveloperValues(packageMeta?.latest[type]),
    [packageMeta, type]
  );

  const [visibleDevelopersMax, setVisibleDevelopersMax] = useState(visibleMax);
  const [visibleDevelopers, setVisibleDevelopers] = useState(developers);

  useEffect(() => {
    if (!developers.length) {
      return;
    }
    setVisibleDevelopers(developers.slice(0, visibleDevelopersMax));
  }, [developers, visibleDevelopersMax]);

  const handleSetVisibleDevelopersMax = useCallback(() => {
    setVisibleDevelopersMax(visibleDevelopersMax + VISIBLE_MAX);
  }, [visibleDevelopersMax]);

  if (!visibleDevelopers || !developers.length) {
    return null;
  }

  return (
    <>
      <Title type={type} />
      <StyledBox display="flex" flexWrap="wrap" margin="10px 0 10px 0">
        {visibleDevelopers.map((visibleDeveloper) => {
          return (
            <Tooltip key={visibleDeveloper.email} title={visibleDeveloper.name}>
              <Avatar alt={visibleDeveloper.name} src={visibleDeveloper.avatar} />
            </Tooltip>
          );
        })}
        {visibleDevelopersMax < developers.length && (
          <Fab onClick={handleSetVisibleDevelopersMax} size="small">
            <Add />
          </Fab>
        )}
      </StyledBox>
    </>
  );
};

export default Developers;
