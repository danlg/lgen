# `smartix:messages-text`

## Functional Requirements

* Create Text Message
* Edit Text Message

## Schema

In addition to the schema defined in `smartix:messages`, messages of type `text` must have, in the `data` property, an object with the following fields:

* `text` *String* - Text of the message

## Templates

* Create Text Message
* Edit Text Message

## Server-Side Functions

### Add Valid type to `Smartix.Messages.ValidTypes` array

Add `text` to `Smartix.Messages.ValidTypes` array (from `smartix:messages` package) on initialization

All server-side functions should be namespaced under `Smartix.Messages.Text`