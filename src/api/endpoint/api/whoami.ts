import { $RequestExtend, $NextFunctionVer } from '../../../../types';
import { Response, Router } from 'express';

export default function (route: Router): void {
  route.get('/whoami', (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
    if (req.get('referer') === 'whoami') {
      next({ username: req.remote_user.name });
    } else {
      next('route');
    }
  });

  route.get('/-/whoami', (req: $RequestExtend, res: Response, next: $NextFunctionVer): any => {
    next({ username: req.remote_user.name });
  });
}
