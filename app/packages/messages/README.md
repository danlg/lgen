# `smartix:messages`

Manages the sending and retrieving of messages in general. Create and edit and functions for each message type is defined in its own package, the create and edit functions defined in this package is to double-ensure the child packages conforms to the schema. Checking for permission should be implemented in child packages. Aggregation of messages into feeds are implemented in other packages.

Because we should keep records of all messages (e.g. in cases where inappropriate messages are sent and the police requests a transcript), deletion must be implemented as soft-deletes. This is achieved by adding a timestamp to the `deletedAt` property of the message.

For the same reason, we should not allow the editing of messages. We can simulate the editing of a message by deleting the previous message and creating a new message, adding the `id` of the previous message to the `versions` array, which stores all previous versions of the message.

## Schema

* `id*` *String* - Unique identifier for the message
* `group*` *String* - The `id` of the group (in our case - either the newsgroup or the class)
* `author*` *String* - The `id` of the user who created the message
* `type*` *String* - The type of message. Different types are defined by other packages. E.g. `messages-text` defines the `text` type, `messages-voice` defines the `voice` type
* `data` *Object* - A blackbox object to store any data specific to the message type
* `hidden*` *Boolean* - Whether the message is hidden from non-admin users
* `createdAt*` *Int* - UNIX timestamp of the message creation date
* `deletedAt*` *Int* - UNIX timestamp of the message deletion date (required for soft-deletion)
* `addons*` *[Object]* - Every object is added by an add-on, each object must have a `type` property indicating the type of add-on. There can only be one of each type in the `addons` array.
* `versions` *[String]* - An array of message `id` for previous versions of the message. Used to simulate editing a message. (See note above)

## Server-side Functions

### `createMessage()`

Checks that the message conforms to the schema and add the message.

#### Arguments

* `options` - Object representing the message. It should include the following fields (all mandatory):

  * `group*` *String* - The `id` of the group (in our case - either the newsgroup or the class). Should not be changed once set.
  * `author*` *String* - The `id` of the user who created the message. Should not be changed once set.
  * `type*` *String* - The type of message. Different types are defined by other packages. E.g. `messages-text` defines the `text` type, `messages-voice` defines the `voice` type
  * `data` *Object* - A blackbox object to store any data specific to the message type
  * `hidden*` *Boolean* - Whether the message is hidden from non-admin users
  * `createdAt*` *Int* - UNIX timestamp of the message creation date
  * `deletedAt*` *Int* - UNIX timestamp of the message deletion date (required for soft-deletion)
  * `addons*` *[Object]* - Every object is added by an add-on, each object must have a `type` property indicating the type of add-on. There can only be one of each type in the `addons` array.
  * `versions` *[String]* - An array of message `id` for previous versions of the message. Used to simulate editing a message. (See note above)

#### Implementation

* Checks that each option is of the valid type
* Checks all mandatory fields are included
* Insert the message and return the `_id`

### `editMessage()`

Simulate the editing of a message.

#### Arguments

* `id*` *String* - `id` of the message
* `alteredProperties*` - Object representing the altered fields

#### Implementation

* Get the original message
* Using `_.assignIn` overwrite any fields in the original message with the ones specified in `options`
* Adds the `_id` of the original message to the `versions` array
* Delete the `_id`
* Create a new message using `createMessage()`

## Server-side Methods

### `hideMessage()`

Allows admin users to hide an (inappropriate) message

#### Arguments

* `id` *String* - `id` of the message to hide

#### Implementation

* `update` the message document with `hidden` set to `true`

### `deleteMessage()`

Deletes a message (of any type).

#### Arguments

* `id` *String* - `id` of the message to be deleted

#### Implementation

* `update` the message document with `deletedAt` set to the current UNIX timestamp (in miliseconds)

### `undeleteMessage()`

Undeletes a message (of any type).

#### Arguments

* `id` *String* - `id` of the message to be deleted

#### Implementation

* `update` the message document with `deletedAt` set to `null`, or delete the property from the object altogether

## Exports

### `Smartix.Messages.ValidTypes`

An array of all the valid message types. Each package that adds a new message type should add their type to this array.