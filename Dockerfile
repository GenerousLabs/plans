FROM node:14

WORKDIR /usr/src/

RUN git clone https://github.com/generouslabs/plans.git .

COPY packages/plans/dist packages/plans/dist
COPY server/dist server/dist

WORKDIR /usr/src/server/

# Install our dependencies
RUN yarn install --production

# We expose port 14000 as that's where the app runs by default
EXPOSE 14000

CMD [ "node", "dist/server" ]
