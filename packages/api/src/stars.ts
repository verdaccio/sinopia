import _ from 'lodash';
import { Response, Router } from 'express';

import { USERS, HTTP_STATUS } from '@verdaccio/commons-api';
import { Package } from '@verdaccio/types';

import { IStorageHandler } from '@verdaccio/store';
import { $RequestExtend, $NextFunctionVer } from '../types/custom';

type Packages = Package[];

export default function (route: Router, storage: IStorageHandler): void {
  route.get(
    '/-/_view/starredByUser',
    (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
      const remoteUsername = req.remote_user.name;

      storage.getLocalDatabase((err, localPackages: Packages) => {
        if (err) {
          return next(err);
        }

        const filteredPackages: Packages = localPackages.filter((localPackage: Package) =>
          _.keys(localPackage[USERS]).includes(remoteUsername)
        );

        res.status(HTTP_STATUS.OK);
        next({
          rows: filteredPackages.map((filteredPackage: Package) => ({
            value: filteredPackage.name,
          })),
        });
      });
    }
  );
}
