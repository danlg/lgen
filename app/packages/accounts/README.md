# `smartix:accounts`

Account Management for the Smartix platform.

## Functional Requirements

* Create first system admin user when initializing
* Each User account is tied to a school, *global*, and/or the entire system (system admin)
* Create User is not implemented here, instead it is implemented in one of the following packages - `accounts-global`, `accounts-school` and `accounts-system`
* Edit Self User
* Soft-delete Self User
* View Self User data
* Search Users by name (first and/or last) - done using `easy:search` package, implementation TBC.

* After login, if the user's email address belongs to multiple institutions (i.e. any schools, `global` and/or `system`), they can pick which school/*global*/system they want to interact with; otherwise, they'll be redirected to the school's user dashboard

## Schema

`smartix:accounts` will use the Meteor Account's `users` collection.

Properties with an asterisk (`*`) is mandatory.

* `id*` *String* - Unique key
* `email*` *String* - Contact Email Address , must be unique
* `firstName*` *String* - First Name
* `lastName*` *String* - Last Name
* `dob` *Date* - Date of Birth
* `tel` *String* - Telephone number
* `schools` *[String]* - An array of `id`s from the `smartix:schools` collection (added by the `smartix:accounts-schools` package)
* `roles` *Unknown* - Used by the `alanning:roles` package
* `deletedAt` *Int* - UNIX timestamp (in miliseconds) of when the user is deleted (required for soft deletion)

## Routes

* Users will have routes `/u/[username]`
* After login, if the user belongs to multiple institutions (i.e. any schools, `global` and/or `system`), they'll be redirected to `/select-institution/`
* Schools will have the route `/i/[username]`

## Templates

* Login
* Create New User
* Search User - using [`easy:search`](https://github.com/matteodem/meteor-easy-search)
* View User Details
* Edit User
* Pick School - if the user has a role in multiple accounts, it will need to pick a school/*global*/system on the 'Pick School' screen
  * School Card
  * School Pending Approval Card

## Client-side Functions

### `getUserSchoolCount()`

Counts the number of schools/*global*/system instances where the user has a role (be it as a Student, Parent, Teacher, Admin or User)

### Arguments

None

#### Implementation

* Return the count of the `roles` array (a property of the user's document)

### `listUserSchools()`

Returns a list of all the schools for which the current user plays a role.

### Arguments

None

#### Implementation

* Using the `mySchools()` publication from the `smartix:schools` package, return all the schools

## Server-side Methods

All methods are to be namespaced using a `smartix:accounts/` prefix

### `createUser()`

Create a new user and assigns it to *global*.

#### Arguments

* `options` *Object* - properties of the user

#### Implementation

* Checks that an user with the email address does not already exists, if it does not:
  * The object is cleaned to remove invalid properties (properties not in the schema)
  * Generate unique username using `smartix:accounts-usernames`
  * Create user using `Accounts.createUser`

### `editUser()`

Edit details about a user (apart from user's roles). To edit a user's role for a school, use the `assignSchoolRole`, `retractSchoolRole` or `updateScholRole` methods of the `smartix:accounts-schools` package.

#### Arguments

* `id` *String* - `id` of existing user
* `options` *Object* - properties to be changed alongside the new values

#### Implementation

* The object is cleaned to remove invalid properties (properties not in the schema, or those that should not be changed with this method. I.e. `roles`)
* `update` the currently-logged in user's user document using `$set`

### `deleteUser()`

Soft-delete a user.

#### Arguments

* `id` *String* - `id` of existing user

#### Implementation

* Retrieve a list of all schools/*global*/system/newsgroups/classes for which the user is the only admin
* If the above list is not empty, throw an error message informing the user
* Otherwise `update` the currently-logged in user object by `$set`ting the `deletedAt` property to the current UNIX timestamp (in miliseconds)

## Publications

Publications in this package are available only for the logged-in user and the system administrator. A separate publication for users belonging to global/schools are defined in the `smartix:accounts-global`/`smartix:accounts-schools` packages.

All publications are to be namespaced using a `smartix:accounts/` prefix

### `allUsers()`

Returns a list of all users.

#### Arguments

* `options` *Object* - The query object

#### Implementation

* Checks that the user is a system administrator
* Return the queried cursor