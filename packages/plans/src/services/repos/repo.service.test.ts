import LightningFS from '@isomorphic-git/lightning-fs';
import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'jest-without-globals';
import { connectionsYaml } from '../../fixtures';
import { FS } from '../../shared.types';
import { getConnectionsFromRepo } from './repos.service';

describe('repo service', () => {
  describe('getConnectionsFromRepo()', () => {
    let fs: FS;
    beforeEach(async () => {
      fs = new LightningFS('__plans_tests', { wipe: true });
      await fs.promises.mkdir('/empty');
      await fs.promises.mkdir('/repo');
      await fs.promises.writeFile('/repo/connections.yaml', connectionsYaml);
    });

    it('throws when connections.yaml not found #Fv6TVV', async () => {
      await expect(
        getConnectionsFromRepo({
          fs,
          dir: '/empty',
        })
      ).rejects.toThrow();
    });

    it('successfully reads and parses connections.yaml #7vAlyp', async () => {
      expect(
        await getConnectionsFromRepo({ fs, dir: '/repo' })
      ).toMatchSnapshot();
    });
  });
});
