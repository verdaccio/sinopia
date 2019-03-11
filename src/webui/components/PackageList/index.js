import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';

import Package from '../Package';
import Help from '../Help';
import { formatLicense } from '../../utils/package';

import classes from './packageList.scss';

export default class PackageList extends React.Component {
  static propTypes = {
    packages: PropTypes.array,
  };

  render() {
    return (
      <div className={"package-list-items"}>
        <div className={classes.pkgContainer}>
          {this.hasPackages() ? this.renderPackages(): <Help /> }
        </div>
      </div>
    );
  }

  hasPackages() {
    const {packages} = this.props;
    return packages.length > 0;
  }

  renderPackages = () => {
    return (
      <Fragment>
        {this.renderList()}
      </Fragment>
    );
  }

  renderList = () => {
    const { packages } = this.props;
    return (
      packages.map((pkg, i) => {
        const { name, version, description, time, keywords, dist, homepage, bugs } = pkg;
        const author = pkg.author;
        // TODO: move format license to API side.
        const license = formatLicense(pkg.license);
        return (
          <React.Fragment key={i}>
            {i !== 0 && <Divider></Divider>}
            <Package {...{ name, dist, version, author, description, license, time, keywords, homepage, bugs }} />
          </React.Fragment>
        );
      })
    );
  }
}
