// expect-error: TS2540
// expect-message: Cannot assign to 'port' because it is a read-only property.
// region: code
type Config = {
  readonly host: string;
  readonly port: number;
};

const config: Config = { host: "localhost", port: 8080 };
config.port = 9090; // @error
console.log(config.port);
// endregion
export {};
