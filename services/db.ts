// Database Service for Casper Accelerate ZK-Rollup
// Prisma client singleton and database operations

import { PrismaClient, TransactionStatus, BatchStatus, ProofJobStatus } from '@prisma/client';

// Prisma client singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-export enums for use in other files
export { TransactionStatus, BatchStatus, ProofJobStatus };

// Account Operations
export const AccountDB = {
  async create(address: string, treeIndex: number, balance: bigint = BigInt(0)) {
    return prisma.account.create({
      data: {
        address,
        treeIndex,
        balance,
        nonce: BigInt(0),
      },
    });
  },

  async getByAddress(address: string) {
    return prisma.account.findUnique({
      where: { address },
    });
  },

  async getByTreeIndex(treeIndex: number) {
    return prisma.account.findUnique({
      where: { treeIndex },
    });
  },

  async getOrCreate(address: string, getNextTreeIndex: () => Promise<number>, initialBalance: bigint = BigInt(0)) {
    let account = await prisma.account.findUnique({
      where: { address },
    });

    if (!account) {
      const treeIndex = await getNextTreeIndex();
      account = await prisma.account.create({
        data: {
          address,
          treeIndex,
          balance: initialBalance,
          nonce: BigInt(0),
        },
      });
    }

    return account;
  },

  async updateBalance(address: string, newBalance: bigint, incrementNonce: boolean = false) {
    return prisma.account.update({
      where: { address },
      data: {
        balance: newBalance,
        ...(incrementNonce ? { nonce: { increment: BigInt(1) } } : {}),
      },
    });
  },

  async list(options?: { limit?: number; offset?: number }) {
    return prisma.account.findMany({
      take: options?.limit ?? 100,
      skip: options?.offset ?? 0,
      orderBy: { createdAt: 'desc' },
    });
  },

  async count() {
    return prisma.account.count();
  },

  async getNextTreeIndex() {
    const result = await prisma.account.aggregate({
      _max: { treeIndex: true },
    });
    return (result._max.treeIndex ?? -1) + 1;
  },
};

// Transaction Operations
export const TransactionDB = {
  async create(data: {
    txHash: string;
    fromAddress: string;
    toAddress: string;
    amount: bigint;
    l1DepositHash?: string;
  }) {
    return prisma.transaction.create({
      data: {
        ...data,
        status: TransactionStatus.PENDING,
      },
    });
  },

  async getById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: { batch: true },
    });
  },

  async getByHash(txHash: string) {
    return prisma.transaction.findUnique({
      where: { txHash },
      include: { batch: true },
    });
  },

  async getPending(limit: number = 10) {
    return prisma.transaction.findMany({
      where: { status: TransactionStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  },

  async updateStatus(id: string, status: TransactionStatus, batchId?: number) {
    return prisma.transaction.update({
      where: { id },
      data: {
        status,
        ...(batchId !== undefined ? { batchId } : {}),
      },
    });
  },

  async updateBatch(ids: string[], batchId: number, status: TransactionStatus) {
    return prisma.transaction.updateMany({
      where: { id: { in: ids } },
      data: { batchId, status },
    });
  },

  async list(options?: {
    status?: TransactionStatus;
    batchId?: number;
    fromAddress?: string;
    toAddress?: string;
    limit?: number;
    offset?: number;
  }) {
    return prisma.transaction.findMany({
      where: {
        ...(options?.status ? { status: options.status } : {}),
        ...(options?.batchId ? { batchId: options.batchId } : {}),
        ...(options?.fromAddress ? { fromAddress: options.fromAddress } : {}),
        ...(options?.toAddress ? { toAddress: options.toAddress } : {}),
      },
      include: { batch: true },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
      orderBy: { createdAt: 'desc' },
    });
  },

  async count(status?: TransactionStatus) {
    return prisma.transaction.count({
      where: status ? { status } : {},
    });
  },
};

// Batch Operations
export const BatchDB = {
  async create(oldRoot: string, newRoot: string) {
    return prisma.batch.create({
      data: {
        oldRoot,
        newRoot,
        status: BatchStatus.PENDING,
      },
    });
  },

  async getById(id: number) {
    return prisma.batch.findUnique({
      where: { id },
      include: {
        transactions: true,
        proofJob: true,
      },
    });
  },

  async updateStatus(id: number, status: BatchStatus, l1TxHash?: string) {
    return prisma.batch.update({
      where: { id },
      data: {
        status,
        ...(l1TxHash ? { l1TxHash } : {}),
      },
    });
  },

  async updateRoot(id: number, newRoot: string) {
    return prisma.batch.update({
      where: { id },
      data: { newRoot },
    });
  },

  async list(options?: {
    status?: BatchStatus;
    limit?: number;
    offset?: number;
  }) {
    return prisma.batch.findMany({
      where: options?.status ? { status: options.status } : {},
      include: {
        transactions: true,
        proofJob: true,
      },
      take: options?.limit ?? 20,
      skip: options?.offset ?? 0,
      orderBy: { id: 'desc' },
    });
  },

  async count(status?: BatchStatus) {
    return prisma.batch.count({
      where: status ? { status } : {},
    });
  },

  async getLatest() {
    return prisma.batch.findFirst({
      orderBy: { id: 'desc' },
      include: {
        transactions: true,
        proofJob: true,
      },
    });
  },
};

// Proof Job Operations
export const ProofJobDB = {
  async create(batchId: number) {
    return prisma.proofJob.create({
      data: {
        batchId,
        status: ProofJobStatus.QUEUED,
        progress: 0,
        progressMsg: 'Queued for processing',
      },
    });
  },

  async getById(id: string) {
    return prisma.proofJob.findUnique({
      where: { id },
      include: { batch: true },
    });
  },

  async getByBatchId(batchId: number) {
    return prisma.proofJob.findUnique({
      where: { batchId },
      include: { batch: true },
    });
  },

  async updateProgress(id: string, progress: number, progressMsg: string, status?: ProofJobStatus) {
    return prisma.proofJob.update({
      where: { id },
      data: {
        progress,
        progressMsg,
        ...(status ? { status } : {}),
      },
    });
  },

  async updateStatus(id: string, status: ProofJobStatus, data?: {
    progress?: number;
    progressMsg?: string;
    proofData?: any;
    publicSignals?: any;
    proofHash?: string;
    errorMessage?: string;
    startedAt?: Date;
    completedAt?: Date;
  }) {
    return prisma.proofJob.update({
      where: { id },
      data: {
        status,
        ...data,
      },
    });
  },

  async getActive() {
    return prisma.proofJob.findMany({
      where: {
        status: {
          in: [
            ProofJobStatus.QUEUED,
            ProofJobStatus.LOADING_CIRCUIT,
            ProofJobStatus.BUILDING_WITNESS,
            ProofJobStatus.GENERATING_PROOF,
          ],
        },
      },
      include: { batch: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  async list(options?: {
    status?: ProofJobStatus;
    limit?: number;
    offset?: number;
  }) {
    return prisma.proofJob.findMany({
      where: options?.status ? { status: options.status } : {},
      include: { batch: true },
      take: options?.limit ?? 20,
      skip: options?.offset ?? 0,
      orderBy: { createdAt: 'desc' },
    });
  },
};

// Merkle Tree State Operations
export const MerkleTreeStateDB = {
  async get() {
    return prisma.merkleTreeState.findUnique({
      where: { id: 'singleton' },
    });
  },

  async upsert(root: string, leafCount: number, treeDepth: number = 16) {
    return prisma.merkleTreeState.upsert({
      where: { id: 'singleton' },
      update: { root, leafCount },
      create: { id: 'singleton', root, leafCount, treeDepth },
    });
  },

  async updateRoot(root: string) {
    return prisma.merkleTreeState.update({
      where: { id: 'singleton' },
      data: { root },
    });
  },

  async incrementLeafCount() {
    return prisma.merkleTreeState.update({
      where: { id: 'singleton' },
      data: { leafCount: { increment: 1 } },
    });
  },
};

// Database health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Cleanup function for graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
