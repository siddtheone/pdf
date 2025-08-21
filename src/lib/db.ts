import { openDB } from "idb";

const DB_NAME = "pdf_wallpaper";
const STORE = "state";
const KEY = "singleton";

type LayoutMode = "single" | "spread";

export type PersistedState = {
  pdfData?: ArrayBuffer;
  lastPage?: number;
  layout?: LayoutMode;
  overlay?: boolean;
};

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    },
  });
}

export async function saveState(state: PersistedState) {
  const db = await getDb();
  await db.put(STORE, state, KEY);
}

export async function getSavedState(): Promise<PersistedState | undefined> {
  const db = await getDb();
  const value = (await db.get(STORE, KEY)) as PersistedState | undefined;
  return value;
}
