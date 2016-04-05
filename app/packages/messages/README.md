# `smartix:messages`

Manages the sending and retrieving of messages in general. Create and edit and functions for each message type is defined in its own package. Aggregation of messages into feeds are implemented in other packages.

Because we should keep records of all messages (e.g. in cases where inappropriate messages are sent and the police requests a transcript), deletion must be implemented as soft-deletes. This is achieved by adding a timestamp to the `deletedAt` property of the message.

## Schema

* `id` *String* - Unique identifier for the message
* `group` *String* - The `id` of the group (in our case - either the newsgroup or the class)
* `author` *String* - The `id` of the user who created the message
* `type` *String* - The type of message. Different types are defined by other packages. E.g. `messages-text` defines the `text` type, `messages-voice` defines the `voice` type
* `hidden` *Boolean* - Whether the message is hidden from non-admin users
* `createdAt` *Int* - UNIX timestamp of the message creation date
* `deletedAt` *Int* - UNIX timestamp of the message deletion date (required for soft-deletion)
* `addons` *[Object]* - Every object is added by an add-on, each object must have a `type` property indicating the type of add-on. There can only be one of each type in the `addons` array.

## Server-side Methods

### `hideMessage()`

Allows admin users to hide an (inappropriate) message

#### Arguments

* `id` *String* - `id` of the message to hide

#### Implementation

* Checks that the currently-logged in user has administrative priviledges for the message it specified (i.e. group admin, school admin, or system admin). Throw an appropriate error if not.
* `update` the message document with `hidden` set to `true`

### `deleteMessage()`

Deletes a message (of any type).

#### Arguments

* `id` *String* - `id` of the message to be deleted

#### Implementation

* Checks that the currently-logged in user has administrative priviledges for the message it specified (i.e. either the message author, group admin, school admin, or system admin). Throw an appropriate error if not.
* `update` the message document with `deletedAt` set to the current UNIX timestamp (in miliseconds)

### `undeleteMessage()`

Undeletes a message (of any type).

#### Arguments

* `id` *String* - `id` of the message to be deleted

#### Implementation

* Checks that the currently-logged in user has administrative priviledges for the message it specified (i.e. either the message author, group admin, school admin, or system admin). Throw an appropriate error if not.
* `update` the message document with `deletedAt` set to `null`, or delete the property from the object altogether

## Exports

### `Messages.ValidTypes`

An array of all the valid message types. Each package that adds a new message type should add their type to this array.