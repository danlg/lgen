# `smartix:groups`

Internal package. Provides the concept of groups to other packages such as `smartix:newsgroups` and `smartix:classes`.

`smartix:groups` is an internal package, do not export it to the main application. Publications and permissions are, by design, not set in this package.

## Functional Requirements

* Create group
* Edit group
* Delete group

* Add user(s) to group
* Remove user(s) from group

* Checks if user is in group

## Schema

* `id*` *String* - Unique identifier
* `users*` *[String]* - Array of users' `id`. Can be empty.
* `namespace*` *String*
* `type*` *String*
* `name` *String* - Human-readable name
* `addons` *[String]* - The list of add-on types allowed

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
	* `addons` *[String]* - The list of add-on types allowed

#### Implementation

* Checks the object conforms to the schema
* Remove duplicates from the `users` and `addons` arrays
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
	* `addons` *[String]* - The list of add-on types allowed

#### Implementation

* Checks the new object properties conforms to the schema
* Remove duplicates from the `users` and `addons` arrays
* Update the group object using `$set`

### `deleteGroup()`

Delete group

#### Arguments

* `id` *String* - `id` of the group to be deleted

#### Implementation

* Checks that `id` is a string
* `remove` the group

### `addUsersToGroup()`

Add user(s) to group

#### Arguments

* `id` *String* - `id` of the group
* `users` *[String]* - Array of `id`s of the users to be added

#### Implementation

* Checks that `id` is a String and `users` is an array of Strings
* Remove duplicates from the `users` array
* Push the new users to the existing array using `$each` modifier with `$addToSet`

### `removeUsersFromGroup()`

Remove user(s) from group

#### Arguments

* `id` *String* - `id` of the group
* `users` *[String]* - Array of `id`s of the users to remove

#### Implementation

* `$pull` the specified users from the existing array using `$pull` and `$in`. See https://docs.mongodb.org/manual/reference/operator/update/pull/ for reference

### `isUserInGroup()`

Checks if a user is a member of the group

#### Argument

* `user` *String* - `id` of the user to check for
* `group` *String* - `id` of the group to check for

#### Implementation

* Retrieve the cursor of the `smartix:groups` collection, matching `id` with `group` and `users` with `user`. I.e.

	collection.find({
		id: group
		users: user
	})

	And then get the `count` of the cursor. If it is above 0, the user is a member of the group.

## Publications

Publications are not defined for `smartix:groups`; instead, packages which uses the `smartix:groups` package should define their own publications.