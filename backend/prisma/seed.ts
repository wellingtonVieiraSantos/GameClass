import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Rarity, Role } from '../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

async function main() {
  console.log('Cleaning existing data...');
  // Delete existing records to allow consecutive seeding attempts.
  await prisma.studentBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.weeklyScore.deleteMany();
  await prisma.student.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleaned existing data.');

  const password = await bcrypt.hash('123456', 10);

  // 1. Create Admin (1)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Master',
      email: 'admin@escola.com',
      password,
      role: Role.ADMIN,
    },
  });
  console.log('Admin inserted:', admin.email);

  // 2. Create Teacher (1)
  const teacherUser = await prisma.user.create({
    data: {
      name: 'Professora Maria',
      email: 'maria@escola.com',
      password,
      role: Role.TEACHER,
      teachers: {
        create: {}
      }
    },
    include: { teachers: true }
  });
  const teacherId = teacherUser.teachers[0].id;
  console.log('Teacher inserted:', teacherUser.email);

  // 3. Create Classroom (1)
  const classroom = await prisma.classroom.create({
    data: {
      name: 'Turma do 1º Ano',
      schoolYear: 2026,
      teacherId: teacherId,
    }
  });
  console.log('Classroom inserted:', classroom.name);

  // 4. Create Students (3)
  const students = [];
  const studentNames = ['Joãozinho', 'Pedrinho', 'Aninha'];
  for (let i = 0; i < 3; i++) {
    const studentUser = await prisma.user.create({
      data: {
        name: studentNames[i],
        email: `aluno${i + 1}@escola.com`,
        password,
        role: Role.STUDENT,
        students: {
          create: {
            classroomId: classroom.id,
          }
        }
      },
      include: { students: true }
    });
    students.push(studentUser.students[0]);
    console.log(`Student inserted: ${studentUser.name} (${studentUser.email})`);
  }

  // 5. Create Badges (4)
  const badgesData = [
    { name: 'Leitor Estrela', description: 'Leu 10 livros', icon: 'star', classroomId: classroom.id, rarity: Rarity.COMMON },
    { name: 'Gênio da Matemática', description: 'Acertou todos os problemas', icon: 'calculator', classroomId: classroom.id, rarity: Rarity.RARE },
    { name: 'Ajudante', description: 'Ajudou um colega', icon: 'handshake', classroomId: classroom.id, rarity: Rarity.EPIC },
    { name: 'Super Presença', description: 'Não faltou nenhuma aula', icon: 'calendar', classroomId: classroom.id, rarity: Rarity.LEGENDARY }
  ];
  const badges = [];
  for (const b of badgesData) {
    const badge = await prisma.badge.create({ data: b });
    badges.push(badge);
  }
  console.log('4 Badges inserted.');

  // 6. Give each student at least one badge
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    // We have 3 students and 4 badges. Each student will get a unique badge (indices 0, 1, 2)
    const badge = badges[i]; 

    await prisma.studentBadge.create({
      data: {
        studentId: student.id,
        badgeId: badge.id,
        classroomId: classroom.id,
        earnedAt: new Date(),
      }
    });
    console.log(`Badge "${badge.name}" awarded to ${studentNames[i]}`);
  }

  // Optional: award the 4th badge randomly to the first student to ensure all badges are used?
  // Not strictly required since the prompt just asked to create 4 badges and each student MUST have *at least* one badge.

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
