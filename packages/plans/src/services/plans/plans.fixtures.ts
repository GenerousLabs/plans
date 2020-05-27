import mockFs from 'mock-fs';

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
    'alice/': {
      [bob.slug]: {
        'index.md': joinFrontmatter(bob),
        plans: {
          [spotify.slug]: {
            'index.md': joinFrontmatter(spotify),
          },
          [nordvpn.slug]: {
            'index.md': joinFrontmatter(nordvpn),
          },
        },
      },
      charlie: {
        'index.md': joinFrontmatter(charlie),
        plans: {
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
  });
};

export const mockFilesystemRestore = () => {
  mockFs.restore();
};
