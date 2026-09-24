import { PrismaClient, Role, Department, TaskStatus } from '@prisma/client';
const prisma = new PrismaClient();
const hash = (value: string) => `demo:${value}`;
async function main() {
  const existingProject = await prisma.project.findFirst({ include: { users: true } });
  if (existingProject && existingProject.users.length > 0) {
    console.log(`Seed already present in project ${existingProject.id}`);
    return;
  }
  await prisma.auditLog.deleteMany(); await prisma.taskDependency.deleteMany(); await prisma.task.deleteMany(); await prisma.user.deleteMany(); await prisma.project.deleteMany();
  const project = await prisma.project.create({ data: { name: 'Atlas Commerce Platform', clientName: 'Atlas Group' } });
  const pm = await prisma.user.create({ data: { email: 'pm@nodewave.test', name: 'Maya PM', passwordHash: hash('password'), role: Role.PM, department: Department.PRODUCT, projectId: project.id } });
  const ui = await prisma.user.create({ data: { email: 'ui@nodewave.test', name: 'Raka UI', passwordHash: hash('password'), role: Role.INTERNAL, department: Department.UI_UX, projectId: project.id } });
  const fe = await prisma.user.create({ data: { email: 'frontend@nodewave.test', name: 'Nadia Frontend', passwordHash: hash('password'), role: Role.INTERNAL, department: Department.FRONTEND, projectId: project.id } });
  await prisma.user.create({ data: { email: 'client@atlas.test', name: 'Atlas Guest', passwordHash: hash('password'), role: Role.CLIENT, department: Department.CLIENT, projectId: project.id } });
  const design = await prisma.task.create({ data: { projectId: project.id, title: 'Design checkout experience', description: 'Create responsive checkout flows and handoff tokens.', department: Department.UI_UX, status: TaskStatus.DONE, clientVisible: true, assigneeId: ui.id } });
  const api = await prisma.task.create({ data: { projectId: project.id, title: 'Build checkout API', description: 'Implement order validation and payment intent endpoints.', department: Department.BACKEND, status: TaskStatus.DONE, clientVisible: true } });
  await prisma.task.create({ data: { projectId: project.id, title: 'Slice checkout screens', description: 'Translate approved UI into production React components.', department: Department.FRONTEND, status: TaskStatus.BLOCKED, clientVisible: true, assigneeId: fe.id, dependencies: { create: [{ dependsOnId: design.id }, { dependsOnId: api.id }] } } });
  await prisma.task.create({ data: { projectId: project.id, title: 'QA release candidate', description: 'Run cross-browser and regression checks.', department: Department.PRODUCT, status: TaskStatus.TODO, clientVisible: false } });
  console.log(`Seeded project ${project.id} with PM ${pm.email}`);
}
main().finally(() => prisma.$disconnect());
