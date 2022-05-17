# Technical Requirements

## Purpose

This document provides a comprehensive overview of the software's layers and parts,
along with high level technical implementation details. It describes what the
software should do, and how it should do it. It serves as a guide for multiple
developers to work in parallel to achieve the same overall goals. It's also a
snapshot of the current and future state of the software; therefore, it should
be updated as requirements and code are changed.

## Goals

- Build a open-source, on-chain web 3 dApp that...
- ...

## Websites

- The dApp will include the following frontend canisters:
  - a secure user portal
    - interactive SPA (single page application), built with React.js
  - a public website
    - generated, static web pages
    - optimized for:
      - search engines
      - social sharing
      - performance

## Portal

### Users

- A new user will be automatically created for every Internet Identity user that logs-in to VG.
- A user will have:
  - a userId (auto-incrementing integer)
  - an Internet Identity principal ID
  - created date

### Accounts

- A user must create at least one account after first logging-in.
- A user may create multiple accounts.
- A user creating an account will be assigned the owner role.
- Multiple users with the owner role will be allowed.
- Any owner can add/remove users to/from the account with different roles.
- All account owners have full account rights including the ability to remove other owners.
- There must always be at least one owner per account (can not remove or change role of last owner).
- Any account owner can transfer the account to another user (after removing all other users).
  - Upon transfer, the new user will be assigned the owner role.
- A user can be associated with one or more accounts with one or more roles for each account.
- An account will have:
  - an accountId (auto-incrementing integer)
  - a handle name (unique)
  - a display name
  - avatar (limited to IC NFT URLs which can only come from verified wallets)
  - associated users
    - with one or more user roles for the account
    - at least one user with the owner role

### Handles

Handle names will:

- be unique
- be changeable
- only consist of alpha-numeric characters and hyphens
- have at least 1 alpha-numeric character
- not exceed 20 characters
- be unrecoverable if all account owners lose their Internet Identity logins

### Account Roles:

- owner: has full access including the ability to add/remove other users by handle (handle ID)
- reader: can view data in any status (draft > published > started > cancelled > ended)
- editor: can modify all data for an account except users
- creator: can create data for an account

### Static website (for SEO)

- Static web pages will be generated from dApp data for:
  - user profiles
    - URL format: /profile/{handle}
  - other content (appropriate for the dApp)
- Links (not buttons) will navigate to the portal with URL segments for deep linking.
- Web pages will be search engine optimized (SEO) as follows:
  - semantic HTML
  - clean CSS class names
    - common external CSS style sheet
  - content focused
  - minimal or no JavaScript
  - meta tags for search engines
    - allows link shares to pull in title and image.
  - meta tags for social apps (Twitter, Facebook, etc.)
- Main sitemap with child sitemaps will be generated daily
  - via heartbeat canister system function
- Will handle permanent redirects
  - if the web site structure changes in the future

## Security

### Data location

- All data will be stored on-chain within canisters controlled with Internet Identity
  authorization.

### Authentication and Authorization

- Authentication will be implemented with Internet Identity.
  - Authenticated sessions will expire:
    - after 30 days
    - or if the frontend is left open in the browser with no activity for more than 60 minutes
    - or if the user signs-out
- The UI should only display features that the user can access.
- The UI will not cache permissions as they must always be checked in real-time on the backend.
- All public canister functions will provide authorization based on the caller principal ID
  unless anonymous access is allowed.
  - Authorization logic may include one or more function calls:
    - IsAuthenticated()
    - IsActive()
    - HasRoles(handle, [Role.Creator, Role.Editor])
    - IsAuthor(id)

### Privacy

- User principal IDs will not be sent to the frontend in any form.

### Bot Defense

- A captcha challenge will be required for:
  - creating an account
  - creating a ...
- The rate at which accounts and other data can be created by a single user will be throttled to a reasonable
  pace for a human, to prevent bots from posting repeatedly.

## Data Storage

- Only text data will be stored, no images or video. (Avatars will come from NFT URLs.)
- All data should adhere to a well-defined domain model which includes entities and relationships
  capable of supporting all perceivable features for current and future versions of the dApp.
  - Each entity type will have a unique ID
    - A function (not a data) will map entity type names to IDs.
  - Each object should have:
    - a unique key (auto-incrementing integer)
- When data is updated (sent from the frontend), it should be packaged neatly in a DTO (data transfer object)
  representing the appropriate entity from the domain model.
- When persisted in the stable memory, each field value (including arrays of IDs for related entities) should
  be saved in a separate hashmap keyed by the object ID, enabling instant retrieval by the object key.

## Backup

- Each entity type should have a corresponding versioned serializer (serialize/deserialize functions).
  - Versioning will enable future improvements and migrations to new serialized data structures.
- The serializer will package the entity in a storage data type.
  - id (composite of entityTypeId + entityId)
  - ver (serializer version)
  - data (serialized object)
  - size (size in bytes)
- Serialized objects will go in a backup queue in the same canister where the entity object is saved in stable memory.
  - The backup canister will deque these objects at frequent intervals and save them in the backup canister.
- The backup canister will dynamically create new bucket canisters, each containing single hashmap to store
  serialized objects by ID. When the storage size of a bucket reaches 2 GB, a new bucket will be created.
- The backup canister will keep a mapping of which bucket (canister ID) an object has been stored in.
  - The bucket canisters will provide secure functions for storing and retrieving objects individually
    or in bulk (an array).
