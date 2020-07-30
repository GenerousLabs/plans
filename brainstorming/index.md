# Plans

The medium term vision is to use git repos as a mechanism to share data.

To start with, the first goal is to let 2 users share digital plans in one
repo. For example, I have a VPN account and my friends are welcome to use it.

The idea is to use git repos as the data transport layer. They have built in
support for signed commits, automatically include a full history, and are
widely deployed, used, and understood.

The whole setup starts with an identity. A private key. The public key is the
user's public "identity". After the identity comes the "me" repo. The "me"
repo contains links to other repos for both data sharing and app installs.

## me

- `/index.md` - My user profile
- `/connections.yaml` - A list of my repos

## shared repos

Alice shares a repo with Bob. To Alice, the repo is called `bob`. To Bob the
repo is called `alice`.

## Data Models

- User
  - id
  - slug
  - name
  - publicKey
  - profilePics
- Repo
  - id
  - slug
  - name
  - connections
    - user_slug - This user's folder name in this repo
    - user_id - Equal to "me" for my own remote / slug combo
    - remote
- App
  - id
  - slug
  - name
  - remote
    - url
- AppInstance - An app running on a repo
  - id
  - repo_id
  - app_id

Invitations

- Invitation
  - sender_username
  - remote_url - A URL including auth params to fetch from
  - body

Plans app models

- UserFolder
  - id
  - user_id
  - appinstance_id
- Plan
  - id
  - slug
  - userfolder_id
  - name
  - description
- Message
  - id
  - plan_id
  - sender_user_id
  - recipient_user_ids
  - time
  - body

# Questions

- Do we already start from scratch with this 2 tier architecture?
- If so, what does that mean? Start again with a new package?
- What's the minimum required to get this running?
  - What would be a useful, deployable, first step?
  - How would we hack this as quick & dirty as possible to get it live?
    - Could we only load plans into redux?
