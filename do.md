# v1

- [ ] Load plan + user + repo
- [ ] Parse user's index.md file

# Others

- [ ] Store my user info somewhere in the me repo
  - Load into redux on startup?
- [ ] Add the username to the repo folder path
  - `alice/connections/bob/bob/plans/...`
  - `alice/connections/bob/alice/plans/...`
  - OR would it be better to do
  - `alice/connections/bob/plans/alice/`
  - `alice/connections/bob/plans/bob/`
    - Plans might be per user, but messages might not be like
    - `alice/connections/bob/messages/`

# Tech

- We likely want a git server like https://www.gabrielcsapo.com/node-git-server/
