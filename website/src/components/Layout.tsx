import React, { FC, Fragment } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Header from './Header';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    main: {
      width: '100%',
    },
  })
);

const Layout: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header onClickOpen={() => {}} />
      <main className={classes.main}>
        {children}
        <Footer />
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
