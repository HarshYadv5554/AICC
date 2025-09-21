-- Add OAuth fields to User table
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;
ALTER TABLE "User" ADD COLUMN "linkedinId" TEXT;
ALTER TABLE "User" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "profilePicture" TEXT;

-- Add unique constraints for OAuth IDs
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX "User_linkedinId_key" ON "User"("linkedinId");
