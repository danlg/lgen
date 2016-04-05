# `smartix:accounts-usernames`

## Functional Requirements

* Generate unique username

## Server-side methods

### `generateUniqueUsername()`

#### Arguments

* `firstName` - First Name
* `lastName` - Last Name

#### Implementation

* Converts both parameters to strings
* Remove non-alphanumeric characters
* Concatenate the first name with last name
* Checks that it is not one of the reserved usernames
* Checks to see if there is another user with the same username, if not, return the username. If there is another user with the same username, append `1` to the end of the username and check again. Repeat by incrementing the number until a unique username is found.