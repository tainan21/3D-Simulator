// HybridAdapter — local-first com sync remoto em idle.
//
// Estratégia:
//  - list(): retorna o que o LOCAL tem. Em paralelo, dispara reconcile com o
//    remoto; se houver diferenças, atualiza o local. O Repository não bloqueia.
//  - put(): grava local imediatamente, agenda push remoto (sem await).
//  - delete(): apaga local imediatamente, agenda delete remoto.
//
// Falhas remotas não derrubam o cliente; o local continua a verdade até
// o próximo reconcile bem-sucedido.

import type { Identifiable, StorageAdapter } from "../repo/types";

export interface HybridAdapterOptions<T extends Identifiable> {
  local: StorageAdapter<T>;
  remote: StorageAdapter<T>;
  /** Callback para o repo recarregar lista após reconcile. */
  onReconciled?: (items: T[]) => void;
}

export function createHybridAdapter<T extends Identifiable>(
  opts: HybridAdapterOptions<T>,
): StorageAdapter<T> {
  const { local, remote, onReconciled } = opts;

  // Reconcile remoto após list, em background. Não bloqueia.
  function reconcile(): void {
    void (async () => {
      try {
        const remoteItems = await remote.list();
        // Substitui local pelo remoto (remoto é canônico em modo hybrid).
        // Em fase futura adicionamos LWW por updatedAt.
        const localItems = await local.list();
        const remoteIds = new Set(remoteItems.map((r) => r.id));
        // Remove itens locais que sumiram remotamente.
        for (const item of localItems) {
          if (!remoteIds.has(item.id)) await local.delete(item.id);
        }
        for (const item of remoteItems) {
          await local.put(item);
        }
        if (onReconciled) onReconciled(remoteItems);
      } catch (err) {
        console.warn("[hybrid] reconcile skipped:", (err as Error).message);
      }
    })();
  }

  return {
    async list(): Promise<T[]> {
      const items = await local.list();
      reconcile();
      return items;
    },
    async put(item: T): Promise<T> {
      const stored = await local.put(item);
      void remote.put(stored).catch((err) => {
        console.warn("[hybrid] remote put failed:", (err as Error).message);
      });
      return stored;
    },
    async delete(id: string): Promise<void> {
      await local.delete(id);
      void remote.delete(id).catch((err) => {
        console.warn("[hybrid] remote delete failed:", (err as Error).message);
      });
    },
  };
}
