# `smartix:groups`

Internal package. Provides the concept of groups to other packages such as `smartix:newsgroups` and `smartix:classes`.

`smartix:groups` is an internal package, do not export it to the main application. Publications and permissions are, by design, not set in this package.

## Functional Requirements

* Create group
* Edit group
* Delete group

* Add user(s) to group
* Remove user(s) from group

## Schema

* `id*` *String* - Unique identifier
* `users*` *[String]* - Array of users' `id`. Can be empty.
* `namespace*` *String*
* `type*` *String*
* `name` *String* - Human-readable name

`namespace` and `type` needs to be defined by the packages that uses `smartix:groups`. In the context of Smartix, the `namespace` would be the `id` of the school, and the `type` would be either `newsgroup` or `class`

## Functional Specification

## Client-side Functions

TBC

## Server-side Functions

All server-side functions are to be namespaced under `Smartix.Groups`

### `createGroup()`

Create a new group

#### Arguments

* `options` *Object* - Group object with the following properties:
	* `users` *[String]* - Array of users' `id`
	* `namespace` *String*
	* `type` *String*
	* `name` *String* - Human-readable name (optional)

#### Implementation

* Checks the object conforms to the schema
* Remove duplicates from the `users` array
* Insert the group object into `smartix:groups` collection and return the `id`

### `editGroup()`

Edit existing group

#### Arguments

* `id` *String* - `id` of the existing group
* `options` *Object* - Group update object with any of the following properties:
	* `users` *[String]* - Array of users' `id`
	* `namespace` *String*
	* `type` *String*
	* `name` *String* - Human-readable name

#### Implementation

* Checks the new object properties conforms to the schema
* Update the group object using `$set`

### `deleteGroup()`

Delete group

#### Arguments

* `id` *String* - `id` of the group to be deleted

#### Implementation

* `remove` the group

### `addUsersToGroup()`

Add user(s) to group

#### Arguments

* `id` *String* - `id` of the group
* `users` *[String]* - Array of `id`s of the users to be added

#### Implementation

* Remove duplicates from the `users` array
* Push the new users to the existing array using `$each` modifier with `$addToSet`

### `removeUsersFromGroup()`

Remove user(s) from group

#### Arguments

* `id` *String* - `id` of the group
* `users` *[String]* - Array of `id`s of the users to remove

#### Implementation

* `$pull` the specified users from the existing array using `$pull` and `$in`. See https://docs.mongodb.org/manual/reference/operator/update/pull/ for reference

## Publications

Publications are not defined for `smartix:groups`; instead, packages which uses the `smartix:groups` package should define their own publications.