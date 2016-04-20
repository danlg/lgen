# `smartix:classes`

Classes is a type of group where users:

* Are subscribed to receive messages posted to the class
* Can post certain types of messages to the class

Allows the following users to create classes:

* Admins of a school
* Teachers of a school
* Any users on *global*

Allows the following users to manage classes:

* Admins of a school
* Admins of the class

## Schema

All fields from `smartix:groups`

* `id*` *String* - Unique identifier
* `users*` *[String]* - Array of users' `id`. Can be empty.
* `namespace*` *String*
* `type*` *String*
* `className` *String* - Human-readable name
* `addons` *[String]* - The list of add-on types allowed

Plus these additional fields:

* `classCode` *String* - An unique name of the class that'll be used to construct the URL. Must contain only alphanumeric characters and/or hyphens (`-`), and must be at least 3 characters long.
* `admins` *[String]* - An array of the `id`s of admin user(s) for this group. Must contain at least one admin.
* `comments` *Boolean* - Whether comments are allowed for this group. Defaults to `false`
* `ageRestricted` *Boolean* - Whether the class should be restricted to users aged 13 or above

## Functional Requirements

* Allows school admins and system admins to:
  * Create class(es)
  * Edit class(es)
  * Delete class(es)
  
  * Add user(s) to a class
  * Remove user(s) from a class

## Server-side Functions

### `getClassesOfUser()`

Get the class(es) a user belongs to

#### Arguments

* `id` *String* - the `id` of the user to query for

#### Implementation

* If no `id` is specified, use the `id` of the currently-logged in user.
* Return the *cursor* of all classes where
  * the specified user `id` is in the `users` property of the class document (use [`$in`](https://docs.mongodb.org/manual/reference/operator/query/in/))

## Server-side Methods

### `createClass()`

Create a new class.

#### Arguments

* `users` *[String]* - an array of user `id`s to be added to the class
* `namespace` *String* - the `id` of the school for which this class belongs to
* `className` *String* - Human-readable name of the class (e.g. Meteor 101)
* `classCode` *String* - `meteor-101`

#### Implementation

* Checks the arguments are of the specified type, convert it if not
* Checks that the currently-logged in user is one of the following:
  * Admin for the school (namespace) specified
  * Teacher for the school (namespace) specified
  * if the namespace is `global`, all users pass
  Throw an appropriate error if not.
* Checks the `classCode` is unique for this namespace
* Add the `type` property and set it to `class`
* Add the `admins` property and assign to it a single-member array, where the only element is the `id` of the currently-logged in user
* Add the `comments` property and set it to `true`
* Passes the modified group object to `Smartix.Groups.createGroup()`, which is provided by the `smartix:groups` package.

### `editClass()`

Edit an existing class.

#### Arguments

* `id` *String* - `id` of the existing class
* `options` *Object* - an object containing key-value pairs of the properties to modify

#### Implementation

* Checks the arguments are of the specified type, convert it if not
* Checks that the currently-logged in user is one of the following:
  * Admin for the school (namespace) specified
  * One of the admins for the class
  Throw an appropriate error if not.
* If the `options` contains a `classCode` property, checks the `classCode` is still unique for this namespace
* If the `options` contains the `admins` property:
  * Ensure the array is not empty
  * loop through the array to ensure the `id`(s) point to valid user objects, and that at least one school admin remains in the array
* Remove the `namespace` and `type` properties from `options`, if they exists
* Passes the `options` object to `Smartix.Groups.editGroup()`, provided by `smartix:groups`

### `deleteClass()`

Delete an existing class.

#### Arguments

* `id` *String* - `id` of the class to be deleted

#### Implementation

* Checks that the currently-logged in user is one of the following:
  * Admin for the school (namespace) specified
  * One of the admins for the class
  Throw an appropriate error if not.
* `remove` the class specified

### `addUsersToClass()`

Add user(s) to a class

#### Arguments

* `id` *String* - `id` of the class
* `users` *[String]* - Array of `id`s of the users to be added

#### Implementation

* Checks that the currently-logged in user is one of the following:
  * Admin for the school (namespace) specified
  * One of the admins for the class
  Throw an appropriate error if not.
* Pass the parameters to `Smartix.Groups.addUsersToGroup()` from the `smartix:groups` package

### `removeUsersFromClass()`

Remove user(s) from a class

#### Arguments

* `id` *String* - `id` of the class
* `users` *[String]* - Array of `id`s of the users to remove

#### Implementation

* Checks that the currently-logged in user is one of the following:
  * Admin for the school (namespace) specified
  * One of the admins for the class
  Throw an appropriate error if not.
* Pass the parameters to `Smartix.Groups.removeUsersFromGroup()` from the `smartix:groups` package

## Publications

### `classInfo()`

Publishes information about class for a given namespace.

#### Arguments

* `id` *String* - `id` of the class

#### Implementation

* Checks that the currently-logged in user is a member of the school (namespace) using `Smartix.Accounts.School.isMember` from the `smartix:accounts-schools` package
* return the cursor for the `smartix:groups` collection , limited to the namespace specified

### `usersInClass()`

Publishes limited information (`id`, `firstName`, `lastName` and `email`) for the list of users in the class

#### Arguments

* `id*` *String* - `id` of the group to publish information for
* `namespace*` *String*

#### Implementation

* Checks that the currently-logged in user is a member of the school (namespace) using `SSmartix.Accounts.School.isMember` from the `smartix:accounts-schools` package
* Retrieve the document object for the class using the `id` and `namespace` specified.
* Return a cursor of the user collection, querying using the `users` array, and limited to the following fields:
  * `id`
  * `firstName`
  * `lastName`
  * `email`

### `classesOfUser()`

Publishes the classes a user is a member of

#### Arguments

* `id` *String* - the `id` of the user to query for

#### Implementation

* Return result of `getClassesOfUser()`