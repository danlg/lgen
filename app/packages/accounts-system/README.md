# `smartix:accounts-system`

## Server-side functions

### `Smartix.Accounts.System.createFirstAdmin()`

Creates the first system admin if one does not exist already.

#### Arguments

None

#### Implementation

To be ran inside `Meteor.startup()`.

* Checks that an user with a the system `admin` does not already exist, if not:
  * Create user with username `admin` and password `admin` using `Accounts.createUser`
  * Assign newly-created user to system `admin` role

## Server-side Methods

All methods are to be namespaced using a `smartix:accounts-system/` prefix

### `assignSystemAdmin()`

Add user(s) to be the system administrator

#### Arguments

* `users` *[String]* - An array of `id`s of users

#### Implementation

* Checks that the calling user has `admin` priviledge for the system
* Use `alanning:roles` package's methods to add system administrator priviledges

### `unassignSystemAdmin()`

Remove user(s) from the system administrator role

#### Arguments

* `users` *[String]* - An array of `id`s of users

#### Implementation

* Checks that the calling user has `admin` priviledge for the system
* Use `alanning:roles` package's methods to remove system administrator priviledges