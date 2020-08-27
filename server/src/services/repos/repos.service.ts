/* eslint-disable @typescript-eslint/camelcase */
import { join } from "path";
import { CONFIG_FILE_NAME, REPOS_ROOT, ME_REPO_NAME } from "../../constants";
import * as yaml from "js-yaml";
import fs from "fs";
import { splitRepo } from "../../util/repoNames";
import logger from "../../util/logger";

export const getRepoPath = ({ org, repo }: { org: string; repo: string }) => {
  return join(REPOS_ROOT, org, repo);
};

export const addConfigFileToRepoPath = (repoPath: string) =>
  join(repoPath, CONFIG_FILE_NAME);

type Config = {
  private_token: string;
  sharing_token: string;
};
const requiredStringProps = ["private_token", "sharing_token"] as const;
const isConfig = (input: unknown): input is Config => {
  for (const prop of requiredStringProps) {
    if (typeof (input as Config)[prop] !== "string") {
      return false;
    }
  }
  return true;
};

export const getConfigForRepoPath = async (repoPath: string) => {
  try {
    const { org } = splitRepo(repoPath);

    const diskPath = getRepoPath({ org, repo: ME_REPO_NAME });
    const configPath = addConfigFileToRepoPath(diskPath);
    const configYaml = await fs.promises.readFile(configPath, {
      encoding: "utf8",
    });
    const config = yaml.safeLoad(configYaml);
    if (isConfig(config)) {
      return config;
    }
    logger.debug("Failed to get config #ofaEoN", {
      config,
      configYaml,
      configPath,
      diskPath,
    });
    // NOTE: After logging here, we want to throw. But we're inside a try /
    // catch, so the throw is outside the try / catch below. Counter intuitive.
  } catch (error) {
    throw new Error("Auth fail. #kdmkwX");
  }

  // NOTE: This is thrown after the `logger.debug()` executes above.
  throw new Error("Auth fail. #aRSzZB");
};

export const checkReadPermissions = async ({
  repoPath,
  token,
}: {
  repoPath: string;
  token: string;
}) => {
  const { private_token, sharing_token } = await getConfigForRepoPath(repoPath);

  if (token === private_token || token === sharing_token) {
    return true;
  }
  throw new Error("Auth failure. #qcSHbN");
};

export const checkWritePermissions = async ({
  repoPath,
  token,
}: {
  repoPath: string;
  token: string;
}) => {
  const { private_token } = await getConfigForRepoPath(repoPath);

  if (token === private_token) {
    return true;
  }
  throw new Error("Auth failure. #XEWrYH");
};
