# `smartix:schools`

School Management for the Smartix platform.

## Functional Requirements

* Create school
* Edit school if user is admin for the school

## Schema

`smartix:schools` will create a collection named `smartix:schools`, it'll be exported as `SmartixSchoolsCol` on both client and server.

Properties with an asterisk (`*`) is mandatory.

* `id*` *String* - Unique key
* `name*` *String* - Human-readable Name of the school
* `username*` *String* - Unique alphanumeric string used in the URL
* `logo` *String* - `id` of the image file in CollectionFS
* `tel` *String* - Telephone number for school
* `web` *String* - Website URL for school
* `email` *String* - Contact Email Address for school
* `active` *Boolean* - Whether the school is active or not
* `deletedAt` *Int* - UNIX timestamp (in miliseconds) of when the school is deleted (required for soft deletion)

## Templates

* Pick School - when a user belongs to multiple schools, allow the user to pick which school it chooses to interact with
* Edit School

## Client-side Functions

All client-side functions are to be added to the object `SmartixSchools`, which will be exported to the client.

### `editSchool()`

Edit details about a school.

#### Arguments

* `id` *String* - `id` of the school to edit
* `options` *Object* - properties to be changed alongside the new values

#### Implementation

* Calls `editSchool`method

### `editLogo()`

#### Arguments

To be confirmed

#### Implementation

* Upload image using CollectionFS
* On callback with the file's `id`, calls `editSchool` method to update only the logo field

## Server-side Methods

All methods are to be namespaced using a `smartix:schools/` prefix

### `createSchool()`

Create a new school.

#### Arguments

* `options` *Object* - properties of the new school
* `admins` *[String]* - An array of admin user(s) for the school


#### Implementation

* Checks that the current user has `admin` priviledge for the system
* The object is cleaned to remove invalid properties (properties not in the schema)
* Generate a unique username for the school that is not in RESERVED_SCHOOL_NAMES
* Insert the object into the `smartix:schools` collection
* If `admin` is not empty:
  * Assign the `admin` users the `admin` role for the newly-created school
  If `admin` is empty:
  * Generate a unique username for the admin user
  * Assign the newly-created user to have the `admin` role

### `editSchool()`

Edit details about a school.

#### Arguments

* `id` *String* - `id` of the school to edit
* `options` *Object* - properties to be changed alongside the new values

#### Implementation

* Checks that the user has `admin` priviledge for this school
* The object is cleaned to remove invalid properties (properties not in the schema, or properties which the admin cannot change - i.e. `active`, `deletedAt` etc.)
* `update` using `$set`

## Publications

All publications are to be namespaced using a `smartix:schools/` prefix

### `mySchools()`

Publishes limited information about un-deleted schools for which the user is a student, parent, teacher and/or admin.

Information is limited to the following fields:

* `id`
* `name`
* `username`
* `logo`
* `tel`
* `web`
* `email`
* `active`

#### Arguments

None

#### Implementation

* Check current user's email in the list of accounts
* Create an array of schools from those accounts
* Return cursor of the `smartix:schools` collection with un-deleted schools

### `allSchools()`

Publishes information about all schools.

#### Arguments

None

#### Implementation

* Check current user is has `admin` priviledge for the system
* Return cursor of the entire `smartix:schools` collection

### `activeSchools()`

Publishes information about all active schools.

#### Arguments

None

#### Implementation

* Check current user is has `admin` priviledge for the system
* Return cursor of the entire `smartix:schools` collection where `active` is `true` or `1`