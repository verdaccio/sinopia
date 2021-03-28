export interface IVerdaccioConfig {
  storagePath: string;
  configPath: string;
  domainPath: string;
  port: number | string;
}

export interface IServerProcess {
  init(binPath: string): Promise<any>;
  stop(): void;
}

// eslint-disable-next-line no-unused-vars
declare class PromiseAssert<IRequestPromise> extends Promise<any> {
  public constructor(options: any);
}
