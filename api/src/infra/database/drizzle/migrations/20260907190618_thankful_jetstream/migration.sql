CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customerEmail" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_products" (
	"orderId" uuid,
	"productId" uuid,
	"quantity" integer NOT NULL,
	"priceInCents" integer NOT NULL,
	CONSTRAINT "order_products_pkey" PRIMARY KEY("orderId","productId")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"imageUrl" varchar NOT NULL,
	"priceInCents" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_orderId_orders_id_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_productId_products_id_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;