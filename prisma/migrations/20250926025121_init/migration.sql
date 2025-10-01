-- CreateTable
CREATE TABLE "players" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "nickname" TEXT,
    "dorsal" INTEGER,
    "position" TEXT NOT NULL,
    "photoUrl" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "organizer" TEXT
);

-- CreateTable
CREATE TABLE "matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "opponent" TEXT NOT NULL,
    "tournamentId" INTEGER,
    "location" TEXT,
    "ourScore" INTEGER NOT NULL,
    "theirScore" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "appearances" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "isStarter" BOOLEAN NOT NULL DEFAULT false,
    "minutes" INTEGER,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER DEFAULT 0,
    "yellow" BOOLEAN NOT NULL DEFAULT false,
    "red" BOOLEAN NOT NULL DEFAULT false,
    "motm" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "appearances_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appearances_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "appearances_playerId_idx" ON "appearances"("playerId");

-- CreateIndex
CREATE INDEX "appearances_matchId_idx" ON "appearances"("matchId");
