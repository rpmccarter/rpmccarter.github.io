type SysErrorCode =
  | 'EPERM'
  | 'ENOENT'
  | 'EIO'
  | 'EACCES'
  | 'EEXIST'
  | 'ENOTDIR'
  | 'EISDIR'
  | 'EINVAL'
  | 'ENOTEMPTY';

export class SysError extends Error {
  constructor(
    public code: SysErrorCode,
    message: string
  ) {
    super(message);
  }
}
