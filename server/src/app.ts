import Server from "node-git-server";
import path from "path";
import logger from "./util/logger";
import { splitRepo } from "./util/repoNames";

const PORT = parseInt(process.env.PORT || "8000");

const repos = new Server(path.join(__dirname, "../data/repos"), {
  autoCreate: true,
  authenticate: ({ type, repo: repoPath, headers }) => {
    return new Promise((resolve, reject) => {
      logger.debug("Starting authentication() #GFjigq", {
        meta: { type, repoPath, headers },
      });

      if (
        process.env.NODE_ENV === "production" &&
        typeof headers.authentication !== "string"
      ) {
        throw new Error("Missing Authentication header. #TWaJrB");
      }

      const { org, repo } = splitRepo(repoPath);

      logger.debug("Parsed repo params #BUy3kT", { meta: { org, repo } });

      if (type === "push") {
        // TODO Check that the token is valid for the user
        return resolve();
      } else if (type === "fetch") {
        // TODO Check if the token validates for this user to read
        return resolve();
      } else {
        return reject("Unknown error. #ftvkPh");
      }
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
  const { repo, commit, branch } = push;
  logger.debug("push #tgbL2b", { a: { repo, commit, branch } });
  push.accept();
});

repos.on("tag", (tag) => {
  const { repo, commit, version } = tag;
  logger.debug("tag #KRCdQs", { a: { repo, commit, version } });
  tag.accept();
});

repos.listen(PORT, () => {
  logger.debug(`Listening on :${PORT}`);
});
