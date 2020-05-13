# Plans

At first, we're launching with a "pod" model. This means that one person must
create and deploy a "pod", and then other people can use the pod to share
plans.

The file format / layout is therefore specific to this use case. Hopefully it
also applies to a multi-pod use case...

## File structure

- `/index.md`
  - Pod info, including updates
- `/userId/index.md`
  - User info for the user with user ID = `userId`
- `/userId/plans/spotify.md`
  - User's spotify plan
- `/userId/plans/planId/index.md`
  - The plan details
- `/userId/plans/planId/secondUserId/index.md`
  - The conversation between `userId` and `secondUserId` about `planId`
- `/userId/plans/planId/secondUserId.md`
  - The conversation between `userId` and `secondUserId` about `planId`
  - Alternative to the above

## Encryption

One simple approach would be to use a pod wide symmetric encryption key. The
git host is not able to see the content, but everybody in the pod can see
everything.

An even simpler approach would be to skip encryption altogether. Only concern
here is, how likely are we to add it later?

Thinking...

- What **needs** to be encrypted?
  - At the very least, the login credentials.
    - Who can access these? Ideally only account holder and sharers.
    - The act of granting a share could be the act of adding a new GPG key to
      the encryption target of this. So you can tell who has access according
      to who can decrypt the text.
      - This might work as a starting point.
      - What kind of encryption???
- Ideally, we'd encrypt everything. In a sort of "git-remote-gcrypt" way.
  - https://spwhitton.name/tech/code/git-remote-gcrypt/
  - This could be added later, it doesn't currently exist in isomorphic-git.
    - https://github.com/isomorphic-git/isomorphic-git/issues/97

What data are we storing?

- User profiles (name, maybe email, phone numbers, etc)
- Service details (name, description)
- Access credentials (text field)
- Conversation messages (between 2 users about a service)
- Pod updates (each one a markdown block)

Perhaps the first question is where do we store this stuff?

- Easiest option, GitHub, GitLab, or Bitbucket

## API

How do we get data?

- With isomorphic-git we can clone the whole repo
- Then the UI can somehow access the filesystem
  - Potentially via a local GraphQL API
    - This might make it easier to separate "local" later
    - Might also be a headache to build
    - Potentially apollo-link-state could support this in some way, it allows
      for the `@client` directive to tell apollo-client to resolve the query
      locally. Unclear if it works for mutations.
    - Hasura example here https://github.com/hasura/client-side-graphql
  - Pushing the data into a redux store might be easier
    - Could also be done server side
    - If the entire pod's state is one tree, could be cached server side
    -

Question? Use gundb? Answer, no. After considering this, let's stick with isomorphic git.
