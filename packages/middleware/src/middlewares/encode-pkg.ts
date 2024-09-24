import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

/**
 * Encode / in a scoped package name to be matched as a single parameter in routes
 * @param req
 * @param res
 * @param next
 */
export function encodeScopePackage(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  if (req.url.indexOf('@') !== -1) {
    // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
    req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F');
  }
  // We don't want to encode @ in the URL so mapping to a scoped package name works correctly
  // e.g.: /%40org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
  if (req.url.indexOf('%40') !== -1) {
    req.url = req.url.replace(/^\/%40/, '/@');
  }
  next();
}
