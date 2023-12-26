interface StoreOptions {
  immutable?: boolean;
  retry?: boolean | Retry;
  ttl?: number | undefined;
  storage?: StorageType;
}
