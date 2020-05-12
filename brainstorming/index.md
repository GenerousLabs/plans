Plans
---

Stack

* Git
* Markdown
* GPG

Folder layout

* `/plans`
* `/plans/index.md`
* `/plans/offers/netflix.md`
* `/plans/seeks/hulu.md`

Peers

In order for two peers to share, they need to establish a shared repository. Alice and Betty.

* Alice and Betty establish a new repo to share
* `/plans/alice/offers/netflix.md`
  - Alice offers to share netflix with Betty
* `/plans/alice/seeks/hulu.md`
  - Alice seeks a share of Hulu

> Idea: Start out without any seeking, only sharing.

***

# Round 2

Folder layout

* `/plans`
* `/plans/index.md`
* `/plans/netflix.md`
* `/plans/netflix/betty/index.md`
  - Alice shares Netflix with Betty

Betty

* `/plans/netflix/alice/index.md`

Why one folder per service? Better one per user.

* `/plans/betty/index.md`
* `/plans/betty/netflix.md`
  - Netflix is shared between Alice and Betty

Then Alice has her own plans?

* `/plans/me/index.md`
* `/plans/me/netflix.md`

Where does this netflix plan info go? Who is it shared with? Is it copied into every shared folder by default? Do I share it with everybody, or maybe later only with some people?

* `/plans/index.md`
* `/plans/netflix.md`
  - Copied to `/plans/betty/netflix.md`
  - Kept in sync by the tool

## UI

What do I want as a user?

First, I want to see a list of the plans that are available to me. Maybe I'm willing to connect to some friends to do that. Then I want to see all the juicy shit that's on offer.

I guess I'm also ready to input some of my own "stuff".

So that might break out into segments like:

* My plans
  - List of the stuff I have in the system and am therefore, by default, offering to my network
  - Who am I "sharing" this with
  - Maybe some kind of update stream, or list of events
* Shared plans
  - Plans that are shared with me
  - Update stream
* Sharing offers
  - Plans that are offered in my network

# Round 3

What about one repo per plan? I create a plan, and then I create a new repo. When I connect to somebody, I share that repo with them. Sharing is at the repo level. We all post updates to the plan, and the "host" merges those changes if they pass some test.
