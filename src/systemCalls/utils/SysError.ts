type SysErrorCode =
  | 'EPERM'
  | 'ENOENT'
  | 'EIO'
  | 'EACCES'
  | 'EBUSY'
  | 'EEXIST'
  | 'ENOTDIR'
  | 'EISDIR'
  | 'EINVAL'
  | 'ENOTEMPTY'
  | 'EGREGIOUS';

export class SysError extends Error {
  constructor(
    public code: SysErrorCode,
    message: string
  ) {
    super(message);
  }
}
