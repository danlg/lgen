# `smartix:messages-article`

## Functional Requirements

* Create Article
* Edit Article

## Schema

In addition to the schema defined in `smartix:messages`, messages of type `article` must have, in addition, the following fields:

* `title` *String* - Title of the Article
* `body` *String* - Body of the article, stored in a format which depends on the WYSIWYG editor

## Templates

* Create Article
* Edit Article

## Client-side Functions

## Server-Side Functions

### Add Valid type to `Messages.ValidTypes` array

Add `type` to `Messages.ValidTypes` array (from `smartix:messages` package) on initialization

## Server-side Methods

### `createArticle()`

Creates a message of type `article`

#### Arguments

`group*` *String* - The `id` of the group
`title*` *String* - Title of the article
`body*` *String* - Body of the article
`addons` *[String]* - An array of add-on types (e.g. `voice`, `poll`)

#### Implementation

* Checks the currently-logged in user has permission to create a message in this group
* Sanitize and validate arguments
* Add `author` property and set to currently-logged in user
* Add `type` property and set to `article`
* Add `hidden` property and set to `false`
* Check the types specified in `addons` are valid types

### `editArticle()`

Edit an article. You are only allowed to edit the title and body of the artile. To add/remove add-ons, call `attachAddon()` and `detachAddon()` from the `smartix:messages-addons` package

#### Arguments

* `id` *String* - The `id` of the article
* `title` *String* - The new tite of the article
* `body` *String* - The new body of the article

#### Implementation

* Checks the currently-logged in user has permission to create a message in this group
* Sanitize and validate arguments
* `update` the message document by `$set`ting the `title` and `body` properties to the new value