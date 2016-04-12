# `smartix:classes-announcements`

<Short Description>

## Schema

Same as `Smartix.Messages.Schema`

## Server-side Functions

### `isTypeAllowed()`

Checks whether messages of this type is allowed. Currently not implemented and returns `true` always.

### `createAnnouncement()`

Create a new announcement for the class

#### Arguments

* `class` *String* - `id` of the class to add the annoucement to
* `type` *String* - The type of announcement it is. Limited to `Smartix.Messages.ValidTypes`
* `data` - *Object* - Object contain data for the announcement. The format of the object would depend on the type of announcement and is defined in the corresponding package for that message type. 

#### Implementation

* Checks whether the currently logged-in user has permission to post announcements in this class
* Checks that this type of announcement is valid
* Checks that this type of announcement is allowed for this class
* Create an announcement object to house all the data
* Get the schema which represents this announcement type and clean the announcement object
* Validate using the same schema to ensure it conforms
* Pass it onto `Smartix.Messages.createMessage` to insert the announcement