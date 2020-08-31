FROM node:14 as builder

WORKDIR /usr/src/

COPY frontend frontend
COPY server server
COPY packages packages
COPY package.json package.json
COPY yarn.lock yarn.lock

# Seems only installing production dependencies doesn't add much right now
# RUN yarn install --production
RUN yarn install
RUN yarn workspaces run build

# ------------------------------------------------------------------------------
# From builder to production image
# ------------------------------------------------------------------------------
# 
# FROM node:14
# 
# WORKDIR /usr/src/

WORKDIR /usr/src/server/

# # Expose the port we use
# EXPOSE 14000

CMD [ "node", "dist/server" ]
