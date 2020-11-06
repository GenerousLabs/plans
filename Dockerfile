# FROM node:14-buster-slim AS base

FROM node:14-buster as builder

WORKDIR /usr/src/

# Copy all the code that we need in order to build
COPY frontend frontend
COPY server server
COPY packages packages
COPY package.json package.json
COPY yarn.lock yarn.lock

# Install all of the required dependencies, including dev dependencies, inside
# the builder container
RUN yarn install

# Run the build command inside each of the yarn workspaces, which includes
# building our server project
RUN yarn workspaces run build

# ------------------------------------------------------------------------------
# From builder to production image
# ------------------------------------------------------------------------------

# Start over with a clean build
# NOTE: We start from the 14-buster-slim build here because we want the
# slimmest possible build for our final production container, but the slim
# container isn't sufficient to build all the node-gyp stuff.
FROM node:14-buster-slim

WORKDIR /usr/src/

# We only need to copy the server/dist directory from the builder
COPY --from=builder /usr/src/server/dist/ ./

# # Expose the port we use
# EXPOSE 14000

CMD [ "node", "dist/" ]
