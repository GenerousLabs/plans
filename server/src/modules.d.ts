declare module "node-git-server" {
  type EventName =
    // | 'close'
    // | 'data'
    // | 'drain'
    // | 'end'
    // | 'error'
    "fetch" | "head" | "info" | "push" | "tag";

  class HttpDuplex {}

  class Service {
    accept: () => void;
    reject: () => void;
  }

  class Server {
    constructor(
      path: string,
      opts?: {
        autoCreate?: boolean;
        /**
         * If authenticate() returns a promise, it will be awaited. If not, the
         * `next()` callback should be invoked without an `error` to signal
         * success, or with an `error` to signal failure.
         */
        authenticate?: (
          params: {
            type: string;
            repo: string;
            /**
             * NOTE: Invoking the `user()` function will cause any requests
             * without a Basic authentication header to return a 401. This
             * triggers git to request a username / password from the user.
             */
            user: (
              callback: (
                username: string,
                password: string,
                error: null
              ) => void
            ) => void;
            headers: { [x: string]: string };
          },
          next: (error?: Error) => void
        ) => Promise<void> | void;
        /**
         * If `opts.checkout` is true, create and expected checked-out repos instead of bare repos
         */
        checkout?: boolean;
      }
    );
    // TODO: Better typing of `action` here
    on(event: EventName, callback: (action: Service) => void): void;
    list(callback: (err: Error, results: string[]) => void): void;
    listen(port: number, callback?: () => void): void;
  }
  export default Server;
}
