# `smartix:newsgroups`

Allows admins of a school to create and manage newsgroups - groups of users which are subscribed to receive certain types of news.

For example, parents might be subscribed to the `parents` newsgroup of School A.

## Schema

All fields from `smartix:groups`

* `id*` *String* - Unique identifier
* `users*` *[String]* - Array of users' `id`. Can be empty.
* `namespace*` *String*
* `type*` *String*
* `name` *String* - Human-readable name

Plus these additional fields:

* `url` *String* - An unique name of the newsgroup that'll be used to construct the URL. Must contain only alphanumeric characters and/or hyphens (`-`).
* `admin` *[String]* - An array of the `id`s of admin user(s) for this group. Must contain at least one admin.
* `comments` *Boolean* - Whether comments are allowed for this group. Defaults to `false`

## Functional Requirements

* Allows school admins and system admins to:
  * Create newsgroup(s)
  * Edit newsgroup(s)
  * Delete newsgroup(s)
  
  * Add user(s) to newsgroup
  * Remove user(s) from newsgroup

## Server-side Functions

### `getNewsGroupOfUser()`

Get newsgroup a user belongs to

#### Arguments

* `id` *String* - the `id` of the user to query for

#### Implementation

* If no `id` is specified, use the `id` of the currently-logged in user.
* Return the *cursor* of all newsgroups where
  * the specified user `id` is in the `users` property of the newsgroup document (use [`$in`](https://docs.mongodb.org/manual/reference/operator/query/in/))
  * the namespace is one where the currently-logged in user has administrative priviledges (i.e. either the admin for the school, or the system admin)

## Server-side Methods

### `createNewsGroup()`

Create a new newsgroup.

#### Arguments

* `users` *[String]* - an array of user `id`s to be added to the newsgroup
* `namespace` *String* - the `id` of the school for which this newsgroup belongs to
* `name` *String* - Human-readable name of the newsgroup (e.g. Grade 7)
* `url` *String* - `grade-7`

#### Implementation

* Checks the arguments are of the specified type, convert it if not
* Checks that the currently-logged in user has administrative priviledges for the namespace it specified (i.e. either the admin for the school, or the system admin). Throw an appropriate error if not.
* Checks the `url` is unique for this namespace
* Add the `type` property and set it to `newsgroup`
* Add the `admin` property and assign to it a single-member array, where the only element is the `id` of the currently-logged in user
* Add the `comments` property and set it to `false`
* Passes the modified group object to `Smartix.Groups.createGroup()`, which is provided by the `smartix:groups` package.

### `editNewsGroup()`

Edit an existing newsgroup.

#### Arguments

* `id` *String* - `id` of the existing newsgroup
* `options` *Object* - an object containing key-value pairs of the properties to modify

#### Implementation

* Checks the arguments are of the specified type, convert it if not
* Checks that the currently-logged in user has administrative priviledges for the namespace of the existing newsgroup (i.e. either the admin for the school, or the system admin). Throw an appropriate error if not.
* If the `options` contains a `url` property, checks the `url` is still unique for this namespace
* If the `options` contains the `admin` property:
  * Ensure the array is not empty
  * loop through the array to ensure the `id`(s) point to valid user objects, and that at least one school admin remains in the array
* Remove the `namespace` and `type` properties from `options`, if they exists
* Passes the `options` object to `Smartix.Groups.editGroup()`, provided by `smartix:groups`

### `deleteNewsGroup()`

Delete an existing newsgroup.

#### Arguments

* `id` *String* - `id` of the newsgroup to be deleted

#### Implementation

* Checks that the currently-logged in user has administrative priviledges for the namespace of the existing newsgroup (i.e. either the admin for the school, or the system admin). Throw an appropriate error if not.
* `remove` the newsgroup specified

### `addUsersToNewsgroup()`

Add user(s) to newsgroup

#### Arguments

* `id` *String* - `id` of the newsgroup
* `users` *[String]* - Array of `id`s of the users to be added

#### Implementation

* Checks that the currently-logged in user has administrative priviledges for the namespace of the existing newsgroup (i.e. either the admin for the school, or the system admin). Throw an appropriate error if not.
* Pass the parameters to `Smartix.Groups.addUsersToGroup()` from the `smartix:groups` package

### `removeUsersFromNewsgroup()`

Remove user(s) from newsgroup

#### Arguments

* `id` *String* - `id` of the newsgroup
* `users` *[String]* - Array of `id`s of the users to remove

#### Implementation

* Checks that the currently-logged in user has administrative priviledges for the namespace of the existing newsgroup (i.e. either the admin for the school, or the system admin). Throw an appropriate error if not.
* Pass the parameters to `Smartix.Groups.removeUsersFromGroup()` from the `smartix:groups` package

## Publications

### `newsgroupInfo()`

Publishes information about newsgroup for a given namespace.

#### Arguments

* `id` *String* - `id` of the newsgroup

#### Implementation

* Checks that the currently-logged in user has administrative priviledges for the namespace of the newsgroup (i.e. either the admin for the school, or the system admin). Throw an appropriate error if not.
* return the cursor for the `smartix:groups` collection , limited to the namespace specified.

### `usersInNewsgroup()`

Publishes limited information (`id`, `firstName`, `lastName` and `email`) for the list of users in the newsgroup

#### Arguments

* `id*` *String* - `id` of the group to publish information for
* `namespace*` *String*

#### Implementation

* Checks that the currently-logged in user has administrative priviledges for the namespace of the newsgroup (i.e. either the admin for the school, or the system admin). Throw an appropriate error if not.
* Retrieve the document object for the newsgroup using the `id` and `namespace` specified.
* Return a cursor of the user collection, querying using the `users` array, and limited to the following fields:
  * `id`
  * `firstName`
  * `lastName`
  * `email`

### `newsgroupsOfUser()`

Publishes the newsgroup a user is subscribed to.

#### Arguments

* `id` *String* - the `id` of the user to query for

#### Implementation

* Return result of `getNewsGroupOfUser()`