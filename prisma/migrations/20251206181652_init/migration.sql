-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'BATCHED', 'PROVING', 'FINALIZED', 'FAILED');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PENDING', 'PROVING', 'PROVED', 'SUBMITTING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProofJobStatus" AS ENUM ('QUEUED', 'LOADING_CIRCUIT', 'BUILDING_WITNESS', 'GENERATING_PROOF', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "treeIndex" INTEGER NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "nonce" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "batchId" INTEGER,
    "l1DepositHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" SERIAL NOT NULL,
    "oldRoot" TEXT NOT NULL,
    "newRoot" TEXT NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'PENDING',
    "l1TxHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofJob" (
    "id" TEXT NOT NULL,
    "batchId" INTEGER NOT NULL,
    "status" "ProofJobStatus" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "progressMsg" TEXT,
    "proofData" JSONB,
    "publicSignals" JSONB,
    "proofHash" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProofJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerkleTreeState" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "root" TEXT NOT NULL,
    "leafCount" INTEGER NOT NULL DEFAULT 0,
    "treeDepth" INTEGER NOT NULL DEFAULT 16,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerkleTreeState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_address_key" ON "Account"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Account_treeIndex_key" ON "Account"("treeIndex");

-- CreateIndex
CREATE INDEX "Account_address_idx" ON "Account"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHash_key" ON "Transaction"("txHash");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_batchId_idx" ON "Transaction"("batchId");

-- CreateIndex
CREATE INDEX "Transaction_fromAddress_idx" ON "Transaction"("fromAddress");

-- CreateIndex
CREATE INDEX "Transaction_toAddress_idx" ON "Transaction"("toAddress");

-- CreateIndex
CREATE INDEX "Batch_status_idx" ON "Batch"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProofJob_batchId_key" ON "ProofJob"("batchId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAddress_fkey" FOREIGN KEY ("fromAddress") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAddress_fkey" FOREIGN KEY ("toAddress") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofJob" ADD CONSTRAINT "ProofJob_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
