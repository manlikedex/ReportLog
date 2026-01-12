-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "characterName" TEXT,
ADD COLUMN     "discordId" TEXT,
ADD COLUMN     "discordName" TEXT,
ADD COLUMN     "fivemIdentifier" TEXT,
ADD COLUMN     "rulesSelected" JSONB;
