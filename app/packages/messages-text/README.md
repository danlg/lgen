# `smartix:messages-text`

## Functional Requirements

* Create Text Message
* Edit Text Message

## Schema

In addition to the schema defined in `smartix:messages`, messages of type `text` must have, in addition, the following fields:

* `text` *String* - Text of the message

## Templates

* Create Text Message
* Edit Text Message

## Client-side Functions

## Server-Side Functions

### Add Valid type to `Smartix.Messages.ValidTypes` array

Add `type` to `Smartix.Messages.ValidTypes` array (from `smartix:messages` package) on initialization

## Server-side Methods

### `createTextMessage()`

Creates a message of type text

#### Arguments

`group*` *String* - The `id` of the group
`text*` *String* - Body of the message
`addons` *[String]* - An array of add-on types (e.g. `voice`, `poll`)

#### Implementation

* Checks the currently-logged in user has permission to create a message in this group
* Sanitize and validate arguments
* Add `author` property and set to currently-logged in user
* Add `type` property and set to `text`
* Add `hidden` property and set to `false`
* Check the types specified in `addons` are valid types

### `editTextMessage()`

Edit a text message. You are only allowed to edit the text of the message. To add/remove add-ons, call `attachAddon()` and `detachAddon()` from the `smartix:messages-addons` package

#### Arguments

* `id` *String* - The `id` of the message
* `text` *String* - The new text of the message

#### Implementation

* Checks the currently-logged in user has permission to create a message in this group
* Sanitize and validate arguments
* `update` the message document by `$set`ting the `text` property to the new value