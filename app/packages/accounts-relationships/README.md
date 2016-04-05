# `accounts-relationships`

## Functional Requirements

* Create relationship between two users in a given namespace
* Edit relationship between two users in a given namespace
* Remove relationship between two users in a given namespace

## Architectural Considerations

Relationships between users must be tied to a particular school. This is because:

* To create relationships globally, users must be able to confirm the relationship. Some users (young students) may not have an app or email to confirm the relationship.
* It'll be too complicated to figure out who notifications will be sent to. This is complicated in cases where the parents are separated but both have children attending the same school.

## Schema

* `from*` *String* - the `id` of the user from which the relationship stems from
* `to*` *String* - the `id` of the user to which the relationship points to
* `type*` *String* - the name of the relationship
* `namespace*` *String* - the namespace of the relationship, which, in our case, would be the `id` of the school for which this relationship is managed.
* `name` *String* - The human-readable name of the relationship (e.g. 'Mother', 'Guardian')

### Example

Jane has two children - John and Jerry. John attends School A whilst Jerry attends School B. If both School A and School B both uses Smartix, the relationship documents might look something like this (psuedo-code):

	{
		from: Jane,
		to: John,
		type: Mother
		namespace School A
	},
	{
		from: Jane,
		to: Jerry,
		type: Mother
		namespace School B
	}

## Templates

Editing relationships can only be done on the student's page. When the admin view a parent, it will see a list of users he/she is related to, the admin can then click through to those students and edit the relationship.

* List of relationships
* View Relationship list item card
* Edit/Delete individual relationship card
* List of related users

## Server-side methods

### `createRelationship()`

Create relationship between two users in a given namespace

#### Arguments

* `options` *Object* - Object with the following properties:
  * `from*` *String* - the `id` of the user from which the relationship stems from
  * `to*` *String* - the `id` of the user to which the relationship points to
  * `type*` *String* - the name of the relationship
  * `namespace*` *String* - the namespace of the relationship, which, in our case, would be the `id` of the school for which this relationship is managed.
  * `name` *String* - The human-readable name of the relationship (e.g. 'Mother', 'Guardian')

#### Implementation

* Checks that the currently-logged in user has admin permission for the namespace specified, or is a system administrator
* Checks that the both users exist and the school is in the users' `school` property (meaning the user approved the school to read their personal information)
* Convert the `name` to type `String`
* Convert `type` to type `String` and remove non-alphanumeric characters
* Insert the relationship document to the `smartix:accounts-relationships` collection

### `editRelationship()`

Edit relationship between two users in a given namespace (Cannot change namespace. To change namespace, remove the relationship and create a new one)

#### Arguments

* `id` *String* - `id` of the relationship to edit
* `options` *Object* - Object with the updated properties:
  * `from*` *String* - the `id` of the user from which the relationship stems from
  * `to*` *String* - the `id` of the user to which the relationship points to
  * `type*` *String* - the name of the relationship
  * `name` *String* - The human-readable name of the relationship (e.g. 'Mother', 'Guardian')

#### Implementation

* Checks that the currently-logged in user has admin permission for the namespace of the relationship, or is a system administrator
* Convert the `name` to type `String`
* Convert `type` to type `String` and remove non-alphanumeric characters
* Update the relationship document to the `smartix:accounts-relationships` collection

### `removeRelationship()`

Remove relationship between two users in a given namespace

#### Implementation

* Checks that the currently-logged in user has admin permission for the namespace of the relationship, or is a system administrator
* Hard-delete the relationship from the `smartix:accounts-relationships` collection

## Publications

### `userRelationships()`

Publishes all user relationship data.

#### Arguments

* `user` - `id` of the user to publish the relationships for.

#### Implementation

* 