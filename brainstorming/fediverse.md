# Pieces

- JSON-LD
  - Can specify JSON documents including links to other documents
  - Provides a spec for defining an "identity" linked to a private key
- WebFinger
  - Resolve a hostname for a username
    - `/.well-known/webfinger?resource=acct:hugo@host.tld`
    - Responds with a JSON-LD document including links
- ActivityPub
  - Send events to a user
  - Could be used to send notifications to the user
- HTTP Signatures
  - Method to sign HTTP requests with a link to the identity of the signer
  - Can be verified by looking up the JSON-LD identity via WebFinger
- Git
  - How to fetch and refetch files

# Objects

- Actor
  - A person or group, can own objects
  - Ideally would have a notification ActivityPub inbox
- Plan
  - Details of a plan that might be shared
  - Might include partially encrypted contents
  - Contents of the file might be fully encrypted
- Conversations
  - Two actors might converse about a Plan
  - A conversation is made up of individual messages
- Messages
  - Sender
  - Recipient
  - Subject (in this case a Plan)
  - Date
  - Content (body)

# Naming

- Plan
- Account
- Service

# Schema

- I create a private key
- I create my own private repo
  - I might store a password encrypted copy of my private key
  - I might store a recovery copy of my private key encrypted to a recovery phrase
  - I store public keys for people I know
    - I might also store their git repos if we have them
  - `/me.pubkey`
  - `/me.privkey.encrypted`
  - `/me.privkey.recovery`
  - `/contacts/bob/index.md`
  - `/contacts/bob/index.pubkey`
  - `/contacts/bob/plans.jsonld`
  - `/contacts/bob/plans.url`
  - `/contacts/bob/plans.giturl`
- I create a user JSON-LD object
  - Could link to my profile picture
  - Could likely contain my preferred name
  - Includes my public key
- I create a git repo with my plans
- I offer to share my plans with Bob
  - I give Bob pull access to my repo
  - Bob authenticates with their private key (or via a token)
    - Bob could potentially retrieve a token valid for a while
  - Bob pulls my repo
- Bob requests to share my spotify plan
  - Bob sends a message that says "

# Schema v2

- I create a private key, my private repo, my plans repo
- I connect to Bob
  - I create a shared repo
  - I grant Bob ready only pull
  - Bob clones the shared repo
  - Bob grants me read only pull
- We each maintain a copy of our shared repo
- We can each pull from the other's repo to keep in sync
- We sign our commits

# Login

- My repo contains
  - A random password salt
  - The hash of salt+password
  - My password encrypted key
- Login process
  - I specify a username
  - Server returns the salt
  - I hash the salt + password, send the result
  - Server verifies, returns encrypted key

# Repos

- We create a shared repo for each connection
  - Can be between 2 people, or more people
  - Each user hosts their own remote
    - They grant read-only access to the other participants
    - They pull from other remotes, and if accepting the updates, push into their own
    - In this way the repos over time converge on a shared state

# Manually

How would we mirror this repo setup manually?

- I am Alice
- I want to connect with Bob
- I create a repo called alice/bob
- I grant Bob read-only access to the repo
  - How do I do this without knowing Bob's credentials?
  - I could give Bob a token that Bob could use to pull?
- I am Bob
- I receive Alice's invitation
  - This includes the URL where I can pull
  - Plus a token I can use to fetch
- I create a repo bob/alice
- I fetch from alice/bob
- I merge into bob/alice
- I give Alice the URL where Alice can pull from bob/alice
  - By this point I likely have Alice's key
  - I could allow key based pulls
