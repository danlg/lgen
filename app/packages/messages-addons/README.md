# `smartix:messages-addons`

Manages add-ons.

## Functional Requirements

* Attach add-on to a message
* Detach add-on from a message

(Editing an add-on is a task to be defined within each add-on package)

## Server-side Functions

All functions are to be exported under `Messages.addOns`.

### `canUserAttachAddon()`

Checks whether the currently-logged in user can attach an add-on of a specified type to a message.

#### Arguments

* `message` *String* - the `id` of the message
* `types` *[String]* - an array with the type(s) of add-on to attach. Each element must be a valid type found in the `Messages.addOns.validTypes` array

#### Implementation

* Retrieve information about the message
* Checks that the currently-logged in user has administrative priviledges for the message it specified (i.e. message author, group admin, school admin, or system admin). Throw an appropriate error if not.
* Checks that the group allows for this type of add-on to be attached (checks the type is within the `addons` array of the group's document)
* Check the message document's `addons` array to ensure an add-on of that type has not been added already. (I.e. If there is already an add-on of type `poll`, do not allow `attachAddon()` to overwrite the existing add-on). Where appropriate, throw an error indicating the add-on already exists.

### `attachAddon()`

Attach an empty add-on of the defined type to a message.

#### Arguments

* `message` *String* - the `id` of the message
* `types` *[String]* - an array with the type(s) of add-on to attach. Each element must be a valid type found in the `Messages.addOns.validTypes` array

#### Implementation

* Use `canUserAttachAddon()` to check the user has permissions to attach this add-on
* `update` the message document's `addons` array. For each element in the `types` array, push an empty object with `type` set.

### `detachAddon()`

Detach addon(s) from the message

#### Arguments

* `message` *String* - the `id` of the message
* `types` *String* - an array with the type(s) of add-on to detach. Each element must be a valid type found in the `Messages.addOns.validTypes` array

#### Implementation

* Use `canUserAttachAddon()` to check the user has permissions to attach this add-on
* `update` the message document's `addons` array, `$pull`ing objects with the `type` property matching one of those specified in the `types` parameter.

## Server-side Methods

Methods are to be namespaced under `smartix:messages-addons`

### `attachAddon()`

Same as `attachAddon()` above.

### `detachAddon()`

Same as `detachAddon()` above.

## Other Exports

### `Messages.addOns.validTypes`

An array of all the valid message add-on types. Each package that adds a new add-on type should add their type to this array.