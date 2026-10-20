# Charity Sturgell Artwork Record Map

**Status:** Cross-repository source map; verified repository paths, not a complete inventory of every original artwork.  
**Purpose:** Connect actual creative artifacts to their source code, narrative records, film-development records, and public gallery without confusing concepts with finished work.

## Canonical public-facing catalog

- [Artwork catalog JSON](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/public/artists/catalog.json)
- [Artists gallery](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/public/artists.html)
- [iCloud artist gallery bridge](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/docs/ICLOUD_ARTIST_GALLERY_BRIDGE.md)

The gallery previously presented imagined artist identities as though they were the main collection. It now lists repository-backed artifacts and labels unverified deployment or completion status. Imagined artist identities remain design concepts, not catalogued finished pieces.

## Verified creative artifacts

| Work | Kind | Source record | Relationship |
|---|---|---|---|
| Afterimage | Interactive generative artwork | [Source](../independent/afterimage/index.html) | Related to Afterimage Orchard and Afterimage Arcade by generative-interaction approach; no claim of direct influence |
| Afterimage Orchard | Interactive generative artwork | [Source](../independent-web/afterimage-orchard/index.html) | Gesture-planted temporary light organisms; separate work from Afterimage |
| Mallow the Slug | Story/screenplay seed | [Screenplay](../Creative_Universe/03_Stories/Mallow_The_Slug/screenplay.md) | Narrative source for the Mallow animation-development path |
| Mallow — Three-Minute Anime | Film/animation development | [Animatic engine note](../Creative_Universe/04_Films/Mallow_Three_Min_Anime/animatic/ENGINE.md) | Linked development record; not proof a finished film exists |

The UI repository adds these source-backed works:

- [Afterimage Arcade](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/independent/afterimage-arcade/index.html)
- [Afterimage Arcade — Echo Room](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/operations/previews/independent/afterimage-arcade-echo-room.html)
- [Archive of Borrowed Gravity](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/independent/archive-of-borrowed-gravity/index.html)
- [The Department of Lost Moons](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/operations/independent_creative_web/previews/department-of-lost-moons.html)

These are direct source records. A source file does not by itself establish that a work is deployed, has a rendered export, or is available as a downloadable image or video.

## Archival conversation connections

The UI repository contains a generated conversation index derived from conversations.json, with 337 conversation records and 86 records categorized as creative-world. It includes titles such as “Visualizing AI Mind Art,” “AI and art creation,” “Draw a dinosaur,” “Creative Preservation Inquiry,” and “Image Interpretation Assistance.”

- [Conversation archive manifest](https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/main/src/data/mcArchiveManifest.json)

**Boundary:** the manifest stores conversation titles, counts, and category metadata; it is not the source media and does not itself recover images uploaded in those conversations. Conversation titles are contextual leads, not proof that an individual artwork is preserved.

## Relationship model

Use explicit typed edges rather than a single vague “related” field:

- **created-as:** source file is the artifact itself (e.g., an interactive HTML artwork).
- **developed-from:** a documented work in progress points to an earlier source record.
- **variant-of:** only when the project explicitly records a variant relationship.
- **shares-technique-with:** same interaction or visual method, without claiming influence.
- **archival-context-for:** a conversation record may explain a period or intention but is not the artwork.
- **planned-gallery-entry-for:** a catalog or UI entry points toward a future asset import.
- **missing-source-for:** an artwork is mentioned but the original file, export, or stable location is not available.
- **inspired-by:** use only with an explicit provenance statement, not a visual guess.

Every connection should record its evidence source, confidence, and what would disconfirm it. Similar color, shape, mood, or title is not proof of shared origin.

## The missing originals problem

The repository contains a bridge document for a user-supplied iCloud shared album, but the inspected tree currently has no connected collection of original image/video binaries under public/artists/. That means we can identify and connect code-built art now, but we cannot honestly claim to have recovered all of Charity's personal original art from the album or from earlier chats.

Next import should preserve, for each selected original:
1. Original filename and source album/context.
2. A stable asset path and checksum.
3. Artist/creator credit as actually known.
4. Creation date only when documented.
5. Media type, dimensions/duration, and rights/privacy choice.
6. Symbolic interpretation as a separate, revisable annotation.
7. Explicit edges to related works, conversation records, music, films, and project concepts.

Do not replace missing originals with generated substitutes. Do not label AI-generated or code-generated artifacts as solely hand-made originals. Keep co-creation and authorship attribution honest.

## Coverage status

- **Repository-backed interactive works:** several source records connected.
- **Story/animation development:** Mallow screenplay and animatic-engine note connected.
- **Gallery UI:** linked to source records and catalog JSON.
- **Conversation archive:** indexed by title and category, but not a substitute for the original media.
- **Charity's original image/video collection:** not yet connected at individual-file level.
- **Completeness:** unknown. No universal or complete archive claim is made.
