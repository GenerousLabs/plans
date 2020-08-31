#!/bin/bash

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

PRIVATE_TOKEN=$(openssl rand -base64 12)
SHARING_TOKEN=$(openssl rand -base64 12)

echo "my_username: ${USERNAME}" >> config.yaml
echo "private_token: ${USERNAME}" >> config.yaml
echo "sharing_token: ${USERNAME}" >> config.yaml
echo "plans_remote: https://user:${PRIVATE_TOKEN}@git.generous.software/${USERNAME}/plans.git" >> config.yaml

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
