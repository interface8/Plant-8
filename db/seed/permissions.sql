-- Add permissions system to enhance role management
-- This is a SQL migration file that would be run through Prisma

-- Create Permission model
-- Add this to your schema.prisma file:

model Permission {
  id   String @id @default(uuid()) @db.Uuid
  name String @unique
  description String?
  resource String // e.g., "users", "products", "investments"
  action String   // e.g., "create", "read", "update", "delete"
  
  // Audit
  createdAt  DateTime  @default(now()) @db.Timestamp(6)
  createdBy  String?   @db.Uuid
  modifiedBy String?   @db.Uuid
  modifiedAt DateTime? @db.Timestamp(6)

  roles RolePermission[]
}

model RolePermission {
  roleId       String @db.Uuid
  permissionId String @db.Uuid
  assignedAt   DateTime @default(now())
  assignedBy   String   @db.Uuid

  role Role @relation(fields: [roleId], references: [id])
  permission Permission @relation(fields: [permissionId], references: [id])

  @@id([roleId, permissionId])
}

-- Seed default permissions
INSERT INTO "Permission" (id, name, description, resource, action) VALUES
  (gen_random_uuid(), 'users.create', 'Create new users', 'users', 'create'),
  (gen_random_uuid(), 'users.read', 'View users', 'users', 'read'),
  (gen_random_uuid(), 'users.update', 'Update user information', 'users', 'update'),
  (gen_random_uuid(), 'users.delete', 'Delete users', 'users', 'delete'),
  (gen_random_uuid(), 'products.create', 'Create new products', 'products', 'create'),
  (gen_random_uuid(), 'products.read', 'View products', 'products', 'read'),
  (gen_random_uuid(), 'products.update', 'Update product information', 'products', 'update'),
  (gen_random_uuid(), 'products.delete', 'Delete products', 'products', 'delete'),
  (gen_random_uuid(), 'investments.create', 'Create investments', 'investments', 'create'),
  (gen_random_uuid(), 'investments.read', 'View investments', 'investments', 'read'),
  (gen_random_uuid(), 'investments.update', 'Update investments', 'investments', 'update'),
  (gen_random_uuid(), 'investments.delete', 'Delete investments', 'investments', 'delete'),
  (gen_random_uuid(), 'admin.access', 'Access admin panel', 'admin', 'access'),
  (gen_random_uuid(), 'reports.read', 'View reports and analytics', 'reports', 'read');