import { promises as fs } from "node:fs";
import path from "node:path";
import { GeneratedProject, PurchaseRecord } from "@/types/project";

interface DatabaseShape {
  projects: GeneratedProject[];
  purchases: PurchaseRecord[];
}

const DB_PATH = path.join(process.cwd(), ".data", "database.json");

async function ensureDbFile(): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    const initial: DatabaseShape = { projects: [], purchases: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readDb(): Promise<DatabaseShape> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw) as DatabaseShape;
}

async function writeDb(data: DatabaseShape): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function saveProject(project: GeneratedProject): Promise<void> {
  const db = await readDb();
  db.projects.unshift(project);
  db.projects = db.projects.slice(0, 200);
  await writeDb(db);
}

export async function getProjectById(id: string): Promise<GeneratedProject | null> {
  const db = await readDb();
  return db.projects.find((project) => project.id === id) ?? null;
}

export async function savePurchase(purchase: PurchaseRecord): Promise<void> {
  const db = await readDb();
  const idx = db.purchases.findIndex((item) => item.orderId === purchase.orderId);
  if (idx >= 0) {
    db.purchases[idx] = purchase;
  } else {
    db.purchases.unshift(purchase);
  }
  db.purchases = db.purchases.slice(0, 1000);
  await writeDb(db);
}

export async function hasPaidOrder(orderId: string): Promise<boolean> {
  const db = await readDb();
  return db.purchases.some((purchase) => purchase.orderId === orderId && purchase.status === "paid");
}
