import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { createFsFromVolume, Volume } from 'memfs';
import { FS } from './shared.types';
import { createStore } from './store';
import { ME_MOCK_REMOTE } from './constants';

// TODO Rename everything in this file
// Currently it's all the same as the mock repos, which is confusing, it would
// make more sense to use different names in this file

export const connectionsYaml = `- id: bob
  folder: bob
  name: Bob
  remote: http://localhost:8174/bob.git
- id: charlie
  folder: charlie
  name: Charlie
  remote: http://localhost:8174/charlie.git`;

export const alice = {
  slug: 'alice',
  data: { name: 'Alice' },
  frontmatter: `---
  name: Alice
  ---`,
  markdown: '',
};
export const bob = {
  slug: 'bob',
  data: { name: 'Bob' },
  frontmatter: `---
name: Bob
---`,
  markdown: '',
};
export const charlie = {
  slug: 'charlie',
  data: { name: 'Charlie' },
  frontmatter: `---
name: Charlie
---`,
  markdown: '',
};
export const aliceMessage = {
  data: { sender: 'alice', dateTimestampSeconds: 1590595620 },
  frontmatter: `---
sender: alice
dateTimestampSeconds: 1590595620
---`,
  markdown: 'Are you up for sharing this with me?',
};
export const charlieMessage = {
  data: { sender: 'charlie', dateTimestampSeconds: 1590595860 },
  frontmatter: `---
sender: charlie
dateTimestampSeconds: 1590595860
---`,
  markdown: "Would love to share this with you if you're interested.",
};

export const testMessage = {
  data: { sender: 'alice', dateTimestampSeconds: 1591281216 },
  frontmatter: `---
sender: alice
dateTimestampSeconds: 1591281216
---`,
  markdown: 'A new message for testing purposes.',
};

export const pia = {
  slug: 'pia',
  data: { name: 'Private Internet Access' },
  frontmatter: `---
name: Private Internet Access
---`,
  markdown: `I hardly ever use it, has 6 device limit
`,
};
export const spotify = {
  slug: 'spotify',
  data: { name: 'Spotify' },
  frontmatter: `---
name: Spotify
---`,
  markdown: `I have two spots on my family plan.
`,
};
export const nordvpn = {
  slug: 'nordvpn',
  data: { name: 'NordVPN' },
  frontmatter: `---
name: NordVPN
---`,
  markdown: `I can use 6 devices at the same time
`,
};
export const omgyes = {
  slug: 'omgyes',
  data: { name: 'OMG Yes' },
  frontmatter: `---
name: OMG Yes
---`,
  markdown: `OMG Yes subscription
`,
};

export const joinFrontmatter = ({
  frontmatter,
  markdown,
}: {
  frontmatter: string;
  markdown: string;
}) => {
  return `${frontmatter}\n${markdown}`;
};

export const createDefaultMockFilesystem = () => {
  return (createFsFromVolume(
    Volume.fromJSON({
      [`/e2e/connections`]: null,
      [`/${alice.slug}/me/connections.yaml`]: connectionsYaml,
      [`/${alice.slug}/${bob.slug}/index.md`]: joinFrontmatter(bob),
      [`/${alice.slug}/${bob.slug}/plans/${alice.slug}/${pia.slug}/index.md`]: joinFrontmatter(
        pia
      ),
      [`/${alice.slug}/${bob.slug}/plans/${bob.slug}/${spotify.slug}/index.md`]: joinFrontmatter(
        spotify
      ),
      [`/${alice.slug}/${bob.slug}/plans/${bob.slug}/${nordvpn.slug}/index.md`]: joinFrontmatter(
        nordvpn
      ),
      [`/${alice.slug}/${charlie.slug}/plans/${alice.slug}/${pia.slug}/index.md`]: joinFrontmatter(
        pia
      ),
      [`/${alice.slug}/${charlie.slug}/plans/${charlie.slug}/${omgyes.slug}/index.md`]: joinFrontmatter(
        omgyes
      ),
      [`/${alice.slug}/${charlie.slug}/plans/${charlie.slug}/${omgyes.slug}/message-${aliceMessage.data.dateTimestampSeconds}.md`]: joinFrontmatter(
        aliceMessage
      ),
      [`/${alice.slug}/${charlie.slug}/plans/${charlie.slug}/${omgyes.slug}/message-${charlieMessage.data.dateTimestampSeconds}.md`]: joinFrontmatter(
        charlieMessage
      ),
      [`/daniella/plans/empty`]: null,
      [`/elena/index.md`]: '',
    })
  ) as unknown) as FS;
};

export const mocksWithClonedMeRepo = async () => {
  const fs = createDefaultMockFilesystem();
  await git.clone({ fs, http, dir: '/e2e/me', url: ME_MOCK_REMOTE });
  const store = createStore({
    enableDevTools: false,
    enableRemoteDevTools: false,
  });
  return { fs, http, store };
};
