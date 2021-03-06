import { last } from "remeda";
import { parse } from "url";
import { GIT_DOMAIN, GIT_PROTOCOL } from "../../config";

const ME_REPO_REMOTE_KEY = "__meRepoRemote" as const;

export const assertIsUrl = (input: string): void => {
  const pieces = parse(input);

  if (pieces.host === null) {
    throw new Error("Invalid URL. #LT5zFI");
  }

  return;
};

export const decodeOrFalse = (input: string) => {
  try {
    return globalThis.atob(input);
  } catch {
    return false;
  }
};

export const parsePrivateKey = (input: string) => {
  if (input.indexOf("_") !== -1) {
    const [head, key] = input.split("_");
    if (head !== "PRIVATE") {
      throw new Error("This should be a private key. #34YyAG");
    }
    const decodedKey = decodeOrFalse(key);
    if (decodedKey === false) {
      throw new Error("Invalid private key. #6VAP9K");
    }
    assertIsUrl(decodedKey);
    return decodedKey;
  }

  const baseDecoded = decodeOrFalse(input);

  if (baseDecoded !== false) {
    assertIsUrl(baseDecoded);
    return baseDecoded;
  }

  assertIsUrl(input);

  return input;
};

export const getMeRepoRemote = () => {
  const meRepoRemote =
    globalThis.localStorage.getItem(ME_REPO_REMOTE_KEY) || "";

  if (meRepoRemote.length > 0) {
    return meRepoRemote;
  }

  const remote =
    globalThis.prompt(`Please enter your activation code. #gkR3G9`) || "";

  if (remote.length === 0) {
    alert(`Sorry, something went wrong. #fKohL2`);
    throw new Error("Unknown error. #74jkOP");
  }

  const key = parsePrivateKey(remote);

  globalThis.localStorage.setItem(ME_REPO_REMOTE_KEY, key);

  return key;
};

export const getSharingKey = ({
  token,
  username,
}: {
  token: string;
  username: string;
}) => {
  const url = `${GIT_PROTOCOL}://plans:${token}@${GIT_DOMAIN}/${username}/plans.git`;
  return `SHARING_${username}_${globalThis.btoa(url)}`;
};

export const parseRepoSharingKey = (input: string) => {
  if (input.indexOf("_") !== -1) {
    const pieces = input.split("_");
    const [head] = pieces;

    if (head !== "SHARING") {
      throw new Error("This should be a sharing key. #zPfhut");
    }

    const key = last(pieces);

    if (typeof key !== "string") {
      throw new Error("Invalid sharing key. #vcmHEe");
    }

    const decoded = decodeOrFalse(key);

    if (decoded === false) {
      throw new Error("Invalid sharing key. #Llvcc7");
    }

    assertIsUrl(decoded);

    return decoded;
  }

  const decoded = decodeOrFalse(input);

  if (decoded === false) {
    throw new Error("Invalid sharing key. #Q4sekU");
  }

  assertIsUrl(decoded);

  return decoded;
};
