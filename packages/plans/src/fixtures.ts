import mockFs from 'mock-fs';

export const connectionsYaml = `- id: bob
  folder: bob
  name: Bob
  remote: http://localhost:8174/bob.git
- id: charlie
  folder: charlie
  name: Charlie
  remote: http://localhost:8174/charlie.git`;

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

export const mockFilesystem = () => {
  mockFs({
    e2e: {
      // me: {},
      connections: {
        // bob: {},
        // charlie: {},
      },
    },
    alice: {
      me: {
        'connections.yaml': connectionsYaml,
      },
      [bob.slug]: {
        'index.md': joinFrontmatter(bob),
        plans: {
          [bob.slug]: {
            [spotify.slug]: {
              'index.md': joinFrontmatter(spotify),
            },
            [nordvpn.slug]: {
              'index.md': joinFrontmatter(nordvpn),
            },
          },
        },
      },
      [charlie.slug]: {
        'index.md': joinFrontmatter(charlie),
        plans: {
          [charlie.slug]: {
            [omgyes.slug]: {
              'index.md': joinFrontmatter(omgyes),
              [`message-${aliceMessage.data.dateTimestampSeconds}.md`]: joinFrontmatter(
                aliceMessage
              ),
              [`message-${charlieMessage.data.dateTimestampSeconds}.md`]: joinFrontmatter(
                charlieMessage
              ),
            },
          },
        },
      },
    },
    'daniella/plans/empty': {},
    elena: {
      'index.md': '',
    },
  });
};

export const mockFilesystemRestore = () => {
  mockFs.restore();
};
