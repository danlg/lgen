# `smartix:messages-addons-poll`

## Functional Requirements

Detach poll can be done using `detachAddon()` from the `smartix:messages-addons` package

* Attach poll to a message

* Change polling option's name
* Merge multiple polling options into one
* Remove polling option

* Vote for an option
* Remove vote for an option

## Schema

* `multiple` *Boolean* - Whether a user can cast votes on more than one option. Defaults to `false`
* `options*` *[String]* - An array of options. Emojis are supported and stored as shortnames and translated using `emojione:emojione`
* `expires` *Integer* - The UNIX timestamp (with miliseconds) afterwhich no votes can be cast/uncast. Do not set this property if the poll does not expire.

The votes for each object are stored inside properties with the same name as the option the user is voting for. The resulting object may look something similar to this:

	{
		"type": "poll",
		"options": ['yes', 'no', 'maybe'],
		"yes": ['d1ff5241a342647f', '8da10335c01c8584'],
		"no": [],
		"maybe": ['a6463e2c7d230b17']
	}

## Server-side Methods

Methods are to be namespaced under `smartix:messages-addons-poll`

### `attachPoll()`

Attach a poll to the message specified.

#### Arguments

* `message` *String* - The `id` of the message to attach the poll to
* `multiple` *Boolean* - Whether a user can cast votes on more than one option. Defaults to `false`
* `options` *[String]* - An array of options. Emojis are supported and stored as shortnames and translated using `emojione:emojione`

#### Implementation

* Use `canUserAttachAddon()` from the `smartix:messages-addons` package to check the user has permissions to attach this add-on
* `update` the message document's `addons` array with the poll object.

### `changeOptionName()`

Change the name of an option in the poll

#### Arguments

* `oldName` *String* - The option name to change from
* `newName` *String* - The option name to change to

#### Implementation

* Use `canUserAttachAddon()` from the `smartix:messages-addons` package to check the user has permissions to attach this add-on
* Checks that an option with `oldName` exists in the `options` array. If not, throw an error indicating the option does not exists
* Pull the element matching `oldName` from the `options` array.
* Add `newName` to the `options` array
* 'Rename' the `oldName` property to the `newName` - see [this](http://stackoverflow.com/questions/4647817/javascript-object-rename-key) for different way of implementation

### `mergeOptions()`

Change the name of an option in the poll

#### Arguments

* `options` *[String]* - An array of options to merge from
* `name` *String* - The new option name to merge to. It ***can*** be one of the elements specified in the `options`

#### Implementation

* Use `canUserAttachAddon()` from the `smartix:messages-addons` package to check the user has permissions to attach this add-on
* Checks that all the options specified in the `options` argument exists in the document's `options` array. If not, throw an error indicating thatone of the options does not exists
* Pull the elements in the `options` argument from the `options` array.
* Add `name` to the `options` array
* Create a new object and name it `tmpArr`
* Move all the elements from the appropriate options to this `tmpArr`
* Assign `tmpArr` to the `name` property

### `removeOptions()`

Remove options from a poll










### `castVote()`

Cast a vote for an option in the poll for the currently-logged in user.

#### Arguments

* `message` *String* - The `id` of the message for which the poll is attached to
* `option` *String* - The name of the option for which the current user is casting the vote for

#### Implementation

* Retrieve information about the message, including the group that it belongs to
* Checks the user is a member of said group using `isUserInGroup()` from the `smartix:groups` package
* Retrieve the add-on object from the `addons` array
* Checks that the current time is not after `expires`
* If `multiple` is set to `false`:
  * Go through each option in the object and remove any elements which matches the `id` of the currently-logged in user
* Add the `id` of the currently-logged in user to the array specified by `option`
* Remove duplicates from the array

### `uncastVote()`

Uncast a vote for an option in the poll for the currently-logged in user.

#### Arguments

* `message` *String* - The `id` of the message for which the poll is attached to
* `option` *String* - The name of the option for which the current user is uncasting the vote for

#### Implementation

* Retrieve information about the message, including the group that it belongs to
* Checks the user is a member of said group using `isUserInGroup()` from the `smartix:groups` package
* Retrieve the add-on object from the `addons` array
* Checks that the current time is not after `expires`
* Remove any elements which matches the `id` of the currently-logged in user in the array specified by `option`
