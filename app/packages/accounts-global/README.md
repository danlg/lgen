# `accounts-global`

* Create global users, with a single type `user`
* Update global user
* Delete global user
* Search global users - exact implementation TBC, most likely using `easy:search`
* Publish limited information about global users

## Server-side Methods

### `createGlobalUser()`

Create a new user for *global* if the user does not already exist.

#### Arguments

* `options*` *Object* - properties of the new user

#### Implementation

* Check that an user with the email address does not already exists.
  If user does not already exist:
    * The object is cleaned to remove invalid properties (properties not in the schema)
    * Generate unique username using `smartix:accounts-usernames`
    * Create user using `Accounts.createUser`
    * Assign newly-created user to role(s) (`user` role in namespace `global`)
  If user already exists:
    * Assign the appropriate roles to the user

### `updateGlobalUser()`

Update a user in *global*

#### Arguments

* `user*` *String* - the `id` of the user to be updated
* `options*` *Object* - properties to be updated, alongside its values

#### Implementation

* Checks the currently-logged in user is either one of:
  * Admin of *global*
  * Admin of system
  * The same user as the one being updated
* Clean the object to ensure it is of the right type, and strip out unwanted fields (e.g. `roles`)
* Perform `update` operation with `$set`

### `deleteGlobalUser()`

Remove a user from *global*

#### Arguments

* `user*` *String* - the `id` of the user to be updated

#### Implementation

* Checks the currently-logged in user is either one of:
  * Admin of *global*
  * Admin of system
  * The same user as the one being updated
* Perform `update` operation using `alanning:roles`, removing the appropriate object from the `roles` array

## Publications

### `globalUsersBasicInfo()`

Publishes all publically-available data (First name, last name and email) for users in *global*.

#### Arguments

* `options` *Object* - query object

#### Implementation

* Using `alanning:roles`, find and return all users with the role of `user` in `global`