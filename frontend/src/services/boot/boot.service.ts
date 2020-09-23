const ME_REPO_REMOTE_KEY = "__meRepoRemote" as const;

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
  const decoded = globalThis.atob(remote);
  globalThis.localStorage.setItem(ME_REPO_REMOTE_KEY, decoded);

  return decoded;
};
