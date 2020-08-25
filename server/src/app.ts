import Server from "node-git-server";
import logger from "./util/logger";
import path from "path";

const PORT = parseInt(process.env.PORT || "8000");

const repos = new Server(path.join(__dirname, "../data/repos"), {
  autoCreate: true,
  authenticate: (params) => {
    return new Promise((resolve, reject) => {
      params.user((user, pass) => {
        logger.debug("authenticate #sI3laF", {
          params,
          auth: { user, pass },
        });
        if (user !== "bob") {
          return reject();
        }
        return resolve();
      });
    });
  },
});

/*
repos.on("fetch", (fetch) => {
  logger.debug("fetch #tgbL2b", fetch);
  fetch.reject();
});

repos.on("head", (head) => {
  head.reject();
});

repos.on("info", (info) => {
  logger.debug("info #lBbbLL");
  info.reject();
});
*/

repos.on("push", (push) => {
  logger.debug("push #tgbL2b", push);
  push.accept();
});

repos.on("tag", (tag) => {
  tag.reject();
});

repos.listen(PORT, () => {
  logger.debug(`Listening on :${PORT}`);
});
