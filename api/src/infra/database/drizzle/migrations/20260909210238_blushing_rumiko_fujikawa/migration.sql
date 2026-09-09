CREATE TYPE "order_status" AS ENUM('pending', 'paid');--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "status" "order_status" DEFAULT 'pending'::"order_status" NOT NULL;