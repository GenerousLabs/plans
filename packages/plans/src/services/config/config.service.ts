import * as yaml from 'js-yaml';
import { FS } from '../../shared.types';

export type Config = {
  my_username: string;
  private_token: string;
  sharing_token: string;
  plans_remote: string;
};

const requiredStringProps = [
  'my_username',
  'private_token',
  'sharing_token',
  'plans_remote',
] as const;

const isConfig = (input: unknown): input is Config => {
  for (const prop of requiredStringProps) {
    if (typeof (input as Config)[prop] !== 'string') {
      return false;
    }
  }
  return true;
};

export const readConfigFromFile = async ({
  fs,
  configFilePath,
}: {
  fs: FS;
  configFilePath: string;
}) => {
  const configYaml = await fs.promises.readFile(configFilePath, {
    encoding: 'utf8',
  });

  const config = yaml.safeLoad(configYaml);

  if (isConfig(config)) {
    return config;
  }

  throw new Error('Config file failed validation. #sqyXKf');
};
