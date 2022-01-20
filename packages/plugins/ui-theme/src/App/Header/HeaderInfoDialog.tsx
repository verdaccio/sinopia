/* eslint-disable verdaccio/jsx-spread */
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import { RootState } from '../../store/store';
import LanguageSwitch from './LanguageSwitch';
import RegistryInfoContent from './RegistryInfoContent';
import RegistryInfoDialog from './RegistryInfoDialog';

interface Props {
  isOpen: boolean;
  onCloseDialog: () => void;
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      aria-labelledby={`simple-tab-${index}`}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const TextContent = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  padding: '10px 0',
  backgroundColor: theme?.palette.background.default,
}));

const HeaderInfoDialog: React.FC<Props> = ({ onCloseDialog, isOpen }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const configStore = useSelector((state: RootState) => state.configuration.config);
  const { scope, base } = configStore;
  const { t } = useTranslation();
  return (
    <RegistryInfoDialog onClose={onCloseDialog} open={isOpen}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs aria-label="basic tabs example" onChange={handleChange} value={value}>
            <Tab label={t('packageManagers.title')} {...a11yProps(0)} />
            <Tab label={t('language.title')} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel index={0} value={value}>
          <RegistryInfoContent registryUrl={base} scope={scope} />
        </TabPanel>
        <TabPanel index={1} value={value}>
          <TextContent>{t('language.description')}</TextContent>
          <LanguageSwitch />
        </TabPanel>
      </Box>
    </RegistryInfoDialog>
  );
};

export default HeaderInfoDialog;
