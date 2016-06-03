# `smartix:news`

Generates a news feed from the aggregation of those newsgroups.

## Functional Requirements

## Templates

* (Not used) News Feed (Paginated) - uses [`alethes:pages`](https://github.com/alethes/meteor-pages)
* News Feed (Infinite Scroll) - Uses [`staringatlights:infinite-scroll`](https://github.com/abecks/meteor-infinite-scroll/) to implement an infinite-scrolling page of news. The source will be the publication `newsForUser()`

## Publications

### `newsInGroup()`

#### Arguments

* `id` *String* - The `id` of the group
* `limit` *Int* - The number of news items
* `query` *Object* - Passed by [`staringatlights:infinite-scroll`](https://github.com/abecks/meteor-infinite-scroll/). Not implemented here

#### Implementation

* Publish all non-deleted, non-hidden messages with this group, sorted by `createdAt`, limited by the `limit`

### `newsForUser()`

#### Arguments

* `limit` *Int* - The number of news items
* `query` *Object* - Passed by [`staringatlights:infinite-scroll`](https://github.com/abecks/meteor-infinite-scroll/). Not implemented here

#### Implementation

* Using `getNewsgroupOfUser()` from `smartix:newsgroups`, get all the newsgroup a user is subscribed to
* Using the list, publish all non-deleted, non-hidden messages with this group, sorted by `createdAt`, limited by the `limit`