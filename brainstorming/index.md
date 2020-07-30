# Plans

Very simple first version.

Publish data in a specially formatted git repo. Give others access to let
them "consume" that data.

## Ultra Simple v1

- I create my account, which means I create my own repo
- I create my own profile
- I create my own plans
- I can share my repo with others
- Others can share their repo with me
- My client sucks all the repos in
  - I see my plans / their plans
  - Last updated at the top
  - No messaging

What does the folder structure look like?

- /me
  - /me/connections.yaml
- /bob - my copy of Bob's repo
  - /bob/plans/nordvpn/index.md - Bob's NordVPN plan
- /charlie
  - /charlie/plans/omgyes/index.md

### Shortcuts

- No messaging. Later.
- No GPG keys. Later.
- No identity really. Later.

### Data Models

Questions

- How do users and repos link?
  - I create repos?

Models

- Repo
  - id
  - name
  - slug
  - remote_url
- User - Loaded from a repo
  - id
  - slug
  - name
  - description
- Plan
  - id
  - user_id
  - slug
  - updated_at
  - name
  - description

### Flows

#### Accept invitation

- Somebody sends me a URL
- I enter the URL into my client
- I enter what I want to call this repo
  - eg `Fred`
  - This gets slugified eg `fred`
- My client pulls the repo
  - Puts it into the `connections/fred` directory
  - Parses the data from it and updates my UI
    - First, it loads the user's name & description from the repo
    - Then it loads the plans in the repo
