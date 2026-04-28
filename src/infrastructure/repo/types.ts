// Contratos genéricos do Repository.
//
// Princípios:
//  - leitura é SEMPRE sincrona (snapshot/get) e vem do Map em memória.
//  - mutações (upsert/remove) atualizam o Map imediatamente, disparam
//    evento e agendam flush diferido (idle + debounce) para o adapter.
//  - hidratação é única, no boot, antes do primeiro render.
//  - storage adapter é trocável (Local/Remote/Hybrid) sem mexer em UI.

export type EntityId = string;

export interface Identifiable {
  readonly id: EntityId;
}

export type Unsubscribe = () => void;

export type RepoEvent<T> =
  | { kind: "hydrated"; items: readonly T[] }
  | { kind: "upserted"; item: T }
  | { kind: "removed"; id: EntityId };

export type RepoListener<T> = (event: RepoEvent<T>) => void;

export interface Repository<T extends Identifiable> {
  /** Snapshot estável dos itens em memória. Não toca storage. */
  snapshot(): readonly T[];
  /** Retorna o item por id, ou undefined. Não toca storage. */
  get(id: EntityId): T | undefined;
  /** Inscreve listener; dispara `hydrated` se já hidratado. */
  subscribe(listener: RepoListener<T>): Unsubscribe;
  /** Atualiza memória + agenda flush. Retorna o item normalizado. */
  upsert(item: T): T;
  /** Remove da memória + agenda flush. */
  remove(id: EntityId): void;
  /** Aguarda hidratação inicial completar. */
  ready(): Promise<void>;
  /** Força flush imediato (útil em testes ou em saídas de tela críticas). */
  flushNow(): Promise<void>;
}

/** Adapter de armazenamento — interface mínima para o Repository operar. */
export interface StorageAdapter<T extends Identifiable> {
  list(): Promise<T[]>;
  put(item: T): Promise<T>;
  delete(id: EntityId): Promise<void>;
}

/**
 * Opcional: para entidades com payload pesado (mob package, world snapshot,
 * replay session). O Repository mantém só metadata; o payload é carregado
 * sob demanda por quem precisa.
 */
export interface PayloadAdapter<T extends Identifiable, P> {
  loadPayload(item: T): Promise<P>;
  savePayload?(item: T, payload: P): Promise<T>;
}
