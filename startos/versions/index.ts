import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'

// Single `current`, no prior-version nodes: package changes bump the trailing REVISION
// (`0.2.0:0` -> `0.2.0:1`), which StartOS updates in place with no migration, so the service
// restarts cleanly. This mirrors shulcrum-startos (`#blake:2.1.2:6`, `other: []`). Reserve a version
// bump plus a migration node for a genuine data migration only.
export const versionGraph = VersionGraph.of({ current, other: [] })
