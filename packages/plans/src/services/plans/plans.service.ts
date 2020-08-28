import Bluebird from 'bluebird';
import matter from 'gray-matter';
import { join } from 'path';
import { PLAN_INDEX_FILENAME } from '../../shared.constants';
import { FS, Plan } from '../../shared.types';
import { doesDirectoryExist } from '../../utils/fs.utils';
import mkdirp from 'mkdirp';

const PLANS_FOLDER_NAME = 'plans';

type PlanFrontMatter = {
  name: string;
};

export const _castToData = (input: { [key: string]: any }): PlanFrontMatter => {
  const { name } = input;
  if (typeof name !== 'string') {
    throw new Error('Failed to find name for plan. #6utWPT');
  }
  return { name };
};

export const planMarkdownToData = (markdownWithFrontmatter: string) => {
  const parsed = matter(markdownWithFrontmatter);
  const { content } = parsed;
  const data = _castToData(parsed.data);
  return { content, data };
};

export const addPlansFolderToPath = ({ path }: { path: string }): string => {
  return join(path, PLANS_FOLDER_NAME);
};

/**
 * Given the path to a repository, find the first plan directory which is not
 * ours.
 *
 * So given `alice/bob` as the repo, find `alice/bob/plans/bob` and ignore
 * `alice/bob/plans/alice`.
 */
export const findFirstPlansDirectory = async ({
  fs,
  repoPath,
  myUsername,
}: {
  fs: FS;
  repoPath: string;
  myUsername: string;
}) => {
  const ignoreDirectories = ['.', '..', myUsername];

  const path = addPlansFolderToPath({ path: repoPath });

  if (!(await doesDirectoryExist({ fs, path }))) {
    return;
  }

  const directories = await fs.promises.readdir(path, { withFileTypes: true });

  const found = directories.find((dir) => {
    if (!dir.isDirectory()) {
      return false;
    }
    if (ignoreDirectories.includes(dir.name)) {
      return false;
    }
    return true;
  });

  if (typeof found !== 'undefined') {
    const foundPath = join(path, found.name);
    return { slug: found.name, path: foundPath };
  }

  return;
};

/**
 * Given a user's directory (eg `bob/plans/bob`), get the paths to the child
 * directories, each of which should contain details on a single plan.
 */
export const getChildDirectoriesFromPath = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  // NOTE: LightningFS/readdir does not support `withFileTypes`
  const dir = await fs.promises.readdir(path, {
    encoding: 'utf8',
  });

  // This is a hack to recreate something like `.readdir()` and `withFileTypes`
  const dirStats = await Bluebird.map(dir, async (filename) => ({
    name: filename,
    stat: await fs.promises.stat(join(path, filename)),
  }));

  const plansPaths = dirStats
    .filter((plan) => {
      return plan.stat.isDirectory();
    })
    .map((plan) => ({ path: join(path, plan.name), slug: plan.name }));

  return plansPaths;
};

/**
 * Given a path to the directory containing a plan, find the index and message
 * file paths.
 */
export const getPlanFilesFromDirectory = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  const planFiles = await fs.promises.readdir(path);

  const index = planFiles.find((file) => file === PLAN_INDEX_FILENAME);

  if (typeof index === 'undefined') {
    throw new Error(`Plan does not have index file. #yJtokv`);
  }

  const indexFile = { path: join(path, index), slug: index };

  const messageFiles = planFiles
    .filter((file) => file !== PLAN_INDEX_FILENAME)
    .map((file) => ({ path: join(path, file), slug: file }));

  return { indexFile, messageFiles };
};

/**
 * Return the plan data from the path to its `index.md` file.
 */
export const getPlanDataFromIndexFilePath = async ({
  fs,
  path,
}: {
  fs: FS;
  path: string;
}) => {
  const text = await fs.promises.readFile(path, { encoding: 'utf8' });

  const planData = planMarkdownToData(text);

  return planData;
};

export const planPathToIndexFilePath = ({ path }: { path: string }) => {
  return join(path, PLAN_INDEX_FILENAME);
};

export const planToText = ({
  plan,
}: {
  plan: Pick<Plan, 'description' | 'name'>;
}) => {
  return matter.stringify(plan.description, { name: plan.name });
};

export const writePlanToDisk = async ({
  fs,
  folderPath,
  plan,
}: {
  fs: FS;
  folderPath: string;
  plan: Pick<Plan, 'description' | 'name' | 'slug'>;
}) => {
  const { slug } = plan;
  const newPlanPath = join(folderPath, slug);

  // NOTE: We need to cast `fs` to any here because our FS spec doesn't include
  // the non promised versions, which `mkdirp()` uses.
  await mkdirp(newPlanPath, { fs: fs as any });

  const contents = planToText({ plan });
  const newPlanIndexPath = planPathToIndexFilePath({ path: newPlanPath });

  await fs.promises.writeFile(newPlanIndexPath, contents, { encoding: 'utf8' });

  return newPlanIndexPath;
};
