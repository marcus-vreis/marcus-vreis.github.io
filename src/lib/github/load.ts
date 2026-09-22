import raw from '../../data/github-snapshot.json';
import { parseSnapshot } from './snapshot';

/** O instantâneo commitado, validado uma vez por build. */
export const snapshot = parseSnapshot(raw);
