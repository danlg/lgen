# `smartix:messages-text`

## Functional Requirements

TODO: Need to decide where to check for permissions

* Create Text Message
* Edit Text Message

## Schema

In addition to the schema defined in `smartix:messages`, messages of type `text` must have, in the `data` property, an object with the following fields:

* `text` *String* - Text of the message

## Templates

* Create Text Message
* Edit Text Message

## Client-side Functions

All server-side functions should be namespaced under `Smartix.Messages.Text`

### `createMessage()`

Make a `Meteor.call()` to `smartix:messages-text/createMessage()`

### `editMessage()`

Make a `Meteor.call()` to `smartix:messages-text/editMessage()`

## Server-Side Functions

### Add Valid type to `Smartix.Messages.ValidTypes` array

Add `text` to `Smartix.Messages.ValidTypes` array (from `smartix:messages` package) on initialization

All server-side functions should be namespaced under `Smartix.Messages.Text`

### `createMessage()`

Creates a message of type text

#### Arguments

`group*` *String* - The `id` of the group
`text*` *String* - Body of the message
`addons` *[String]* - An array of add-on types (e.g. `voice`, `poll`)

#### Implementation

* Sanitize and validate arguments
* Add `author` property and set to currently-logged in user
* Add `type` property and set to `text`
* Add `hidden` property and set to `false`
* Check the types specified in `addons` are valid types

### `editMessage()`

Edit a text message. You are only allowed to edit the text of the message. To add/remove add-ons, call `attachAddon()` and `detachAddon()` from the `smartix:messages-addons` package

#### Arguments

* `id` *String* - The `id` of the message
* `text` *String* - The new text of the message

#### Implementation

* Checks the currently-logged in user has permission to create a message in this group
* Sanitize and validate arguments
* `update` the message document by `$set`ting the `text` property to the new value

### Server-side Methods

All server-side methods are to be namespaced under `smartix:messages-text/`

### `createMessage()`

Passes arguments to `Smartix.Messages.Text.createMessage()`

### `editMessage()`

Passes arguments to `Smartix.Messages.Text.editMessage()`