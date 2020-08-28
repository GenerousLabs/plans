import * as yaml from 'js-yaml';
import { FS } from '../../shared.types';

type Config = {
  private_token: string;
  sharing_token: string;
};

const requiredStringProps = ['private_token', 'sharing_token'] as const;

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

  throw new Error('Failed to load config. #sqyXKf');
};
