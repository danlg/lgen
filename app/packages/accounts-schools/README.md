# `smartix:accounts-schools`

## Functional Requirements

* Check if User is in admin role for this school

### Operations by Schools

* Create users for this school, which must belong to one or more of the following roles for each school:
  * Student
  * Parent
  * Teacher
  * Admin
* Assign User(s) to role(s) for this school
* Remove User(s) from role(s) for this school

### Operations by Student

* Approve schools' permission to access personal data
* Revoke schools' permission to access personal data

## Templates

TBC

## Client-side functions

TBC

## Server-side helper functions

### `isUserSchoolAdmin()`

Checks whether a user has `admin` role for a school

#### Arguments

* `school*` - `id` of the school to check for
* `user` *String* - `id` of the user to check for

#### Implementation

* If `user` if `null`, use the `id` of the currently-logged in user
* Use `alanning:roles` to check whether the user has `admin` permission for the school

## Server-side Methods

### `createSchoolUser()`

Create a new user for this school if the user does not already exist.

#### Arguments

* `school*` *String* - `id` of the school for which to create the user for
* `options` *Object* - properties of the new user

#### Implementation

* Checks that the user has `admin` priviledge for this school, or for system
* Check that an user with the email address does not already exists.
  If user does not already exist:
    * The object is cleaned to remove invalid properties (properties not in the schema)
    * Generate unique username using `smartix:accounts-usernames`
    * Create user using `Accounts.createUser`
    * Assign newly-created user to role(s)
  If user already exists:
    * Assign the appropriate roles to the user

### `assignSchoolRole()`

Assign user(s) to role(s) for a particular school

#### Arguments

* `school*` *String* - `id` of the school from the `smartix:schools` collection
* `users` *[String]* - An array of `id`s of users
* `roles` *[String]* - An array of `id`s of roles to assign to the users

#### Implementation

* Checks that the calling user has `admin` priviledge for this school, or for system
* Use `alanning:roles` package's methods to add users to role to this school

### `retractSchoolRole()`

Remove user(s) from role(s) for a particular school

#### Arguments

* `school*` *String* - `id` of the school from the `smartix:schools` collection
* `users` *[String]* - An array of `id`s of users
* `roles` *[String]* - An array of `id`s of roles to retract from the users

#### Implementation

* Checks that the calling user has `admin` priviledge for this school, or for system
* Use `alanning:roles` package's methods to remove roles from users for this school

### `editSchoolRole()`

Edit user(s)'s role to be the array specified, for a particular school

#### Arguments

* `school*` *String* - `id` of the school from the `smartix:schools` collection
* `users` *[String]* - An array of `id`s of users
* `roles` *[String]* - An array of `id`s of roles to change to

#### Implementation

* Checks that the calling user has `admin` priviledge for this school
* Use `alanning:roles` package's methods to change users' roles to be the one specified

### `approveSchool`

User approve the school to read its personal information.

#### Arguments

* `id*` *String* - `id` of the school

#### Implementation

* Add the `id` to the user's document's `schools` property

### `revokeSchool`

User revoke the permission which allowed the school to read its personal information.

#### Arguments

* `id*` *String* - `id` of the school

#### Implementation

* Remove the `id` from the user's document's `schools` property