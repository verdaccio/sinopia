import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from '../../Theme';
import { useConfig } from '../../providers';
import { Time, Versions } from '../../types/packageMeta';
import { Route, utils } from '../../utils';
import Link from '../Link';
import { ListItemText, Spacer } from './styles';

interface Props {
  versions: Versions;
  packageName: string;
  time: Time;
}

export function filterDeprecated(versions: Versions) {
  const versionsIds = Object.keys(versions);
  return versionsIds.reduce((prev, current) => {
    if (!versions[current].deprecated) {
      prev[current] = versions[current];
    }

    return prev;
  }, {});
}

const VersionsHistoryList: React.FC<Props> = ({ versions, packageName, time }) => {
  const { t } = useTranslation();
  const { configOptions } = useConfig();
  const theme: Theme = useTheme();
  const hideDeprecatedVersions = configOptions.hideDeprecatedVersions;
  const listVersions = hideDeprecatedVersions ? filterDeprecated(versions) : versions;

  return (
    <List dense={true}>
      {Object.keys(listVersions)
        .sort((a, b) => {
          const timeA = time[a] ? new Date(time[a]).getTime() : 0;
          const timeB = time[b] ? new Date(time[b]).getTime() : 0;
          return timeB - timeA;
        })
        .map((version) => (
          <ListItem
            className="version-item"
            data-testid={`version-${version}`}
            key={version}
            sx={{ pr: 0 }}
          >
            <Link to={`${Route.DETAIL}${packageName}/v/${version}`} variant="outline">
              <ListItemText
                data-testid={`version-list-link`}
                disableTypography={false}
                primary={version}
              />
            </Link>
            {typeof versions[version]?.deprecated === 'string' ? (
              <Chip
                color="warning"
                data-testid="deprecated-badge"
                label={t('versions.deprecated')}
                size="small"
                sx={{ marginLeft: theme.spacing(1) }}
                variant="outlined"
              />
            ) : null}
            <Spacer />
            <ListItemText data-testid={`version-list-text`} title={utils.formatDate(time[version])}>
              {time[version]
                ? utils.formatDateDistance(time[version])
                : t('versions.not-available')}
            </ListItemText>
          </ListItem>
        ))}
    </List>
  );
};

export default VersionsHistoryList;
