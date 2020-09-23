#!/bin/bash

if [[ -f .env ]]
then
  source .env
fi

if [[ "$GIT_PROTOCOL" != "http" ]] && [[ "$GIT_PROTOCOL" != "https" ]]
then
  echo "GIT_PROTOCOL is not set or is invalid"
  exit 1
fi

if ! [[ -n "$GIT_DOMAIN" ]]
then
  echo "GIT_DOMAIN is not set"
  exit 1
fi

if ! [[ -d $REPOS_PATH ]]
then
  echo "REPOS_PATH is not a directory"
  exit 1
fi

if ! [[ -d $TEMPLATE_PATH ]]
then
  echo "TEMPLATE_PATH is not a directory"
  exit 1
fi

echo "Enter a username"

read USERNAME

echo
echo "About to create a user ${USERNAME}."
echo "${REPOS_PATH}/${USERNAME}"
echo "With template from:"
echo "${TEMPLATE_PATH}"

if [[ -d "${REPOS_PATH}/${USERNAME}" ]]
then
  echo "User already exists"
  exit 1
fi

read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if ! [[ $REPLY =~ ^[Yy]$ ]]
then
  exit 0
fi

mkdir "${REPOS_PATH}/${USERNAME}"
cd "${REPOS_PATH}/${USERNAME}"

mkdir "me.git"
cd "me.git"
git init --template "${TEMPLATE_PATH}"

PRIVATE_TOKEN=$(openssl rand -hex 12)
SHARING_TOKEN=$(openssl rand -hex 12)
ME_REMOTE="${GIT_PROTOCOL}://user:${PRIVATE_TOKEN}@${GIT_DOMAIN}/${USERNAME}/me.git"
PLANS_REMOTE="${GIT_PROTOCOL}://user:${PRIVATE_TOKEN}@${GIT_DOMAIN}/${USERNAME}/plans.git"

echo "my_username: ${USERNAME}" >> config.yaml
echo "private_token: ${PRIVATE_TOKEN}" >> config.yaml
echo "sharing_token: ${SHARING_TOKEN}" >> config.yaml
echo "plans_remote: ${PLANS_REMOTE}" >> config.yaml

git add config.yaml
git commit -m "Initial plans repo for ${USERNAME}."

cd ..

mkdir "plans.git"
cd "plans.git"

git init --template "${TEMPLATE_PATH}"

mkdir -p "plans/${USERNAME}"
touch "plans/${USERNAME}/index.md"

git add plans/
git commit -m "Initial plans repo for ${USERNAME}."

echo
echo "Done"
echo

echo "New remote is:"
echo "${ME_REMOTE}"
echo

echo "Token is:"
if [[ $(uname -s) == "Darwin" ]]
then
  TOKEN=$(echo "${ME_REMOTE}" | base64)
else
  TOKEN=$(echo "${ME_REMOTE}" | base64 --wrap=0)
fi
echo "PRIVATE_$TOKEN"

echo