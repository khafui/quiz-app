// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
//
// async function main() {
//   const q1 = await prisma.question.create({
//     data: {
//       text: 'What is the capital of France?',
//       isMultiple: false,
//       options: {
//         create: [
//           { text: 'Paris' },
//           { text: 'London' },
//           { text: 'Berlin' },
//           { text: 'Madrid' }
//         ]
//       }
//     },
//     include: { options: true }
//   });
//   await prisma.question.update({
//     where: { id: q1.id },
//     data: { correctIds: [q1.options[0].id] }
//   });
//
//   const q2 = await prisma.question.create({
//     data: {
//       text: 'Select front-end technologies:',
//       isMultiple: true,
//       options: {
//         create: [
//           { text: 'JavaScript' },
//           { text: 'HTML' },
//           { text: 'Python' },
//           { text: 'CSS' }
//         ]
//       }
//     },
//     include: { options: true }
//   });
//   await prisma.question.update({
//     where: { id: q2.id },
//     data: { correctIds: [q2.options[0].id, q2.options[1].id, q2.options[3].id] }
//   });
//
//   console.log('Seed complete');
// }
//
// main().catch(e => {
//   console.error(e);
//   process.exit(1);
// }).finally(async () => {
//   await prisma.$disconnect();
// });


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a course
  const dataScienceCourse = await prisma.course.create({
    data: {
      name: 'Data Science',
      description: 'Learn about data analysis, machine learning, and AI.',
      image: 'https://example.com/datascience.png',
    },
  });

  // Create Quiz 1
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Data Science Basics',
      description: 'Test your basic data science knowledge.',
      courseId: dataScienceCourse.id,
    },
  });

  // Add questions to Quiz 1
  const q1 = await prisma.question.create({
    data: {
      text: 'What is the main language used for data analysis?',
      isMultiple: false,
      quizId: quiz1.id,
      options: {
        create: [
          { text: 'Python' },
          { text: 'Java' },
          { text: 'C++' },
          { text: 'Ruby' },
        ],
      },
    },
    include: { options: true },
  });

  await prisma.question.update({
    where: { id: q1.id },
    data: { correctIds: [q1.options[0].id] },
  });

  const q2 = await prisma.question.create({
    data: {
      text: 'Which of these are data visualization tools?',
      isMultiple: true,
      quizId: quiz1.id,
      options: {
        create: [
          { text: 'Tableau' },
          { text: 'Excel' },
          { text: 'Python' },
          { text: 'PowerBI' },
        ],
      },
    },
    include: { options: true },
  });

  await prisma.question.update({
    where: { id: q2.id },
    data: { correctIds: [q2.options[0].id, q2.options[1].id, q2.options[3].id] },
  });

  // Create Quiz 2
  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Machine Learning',
      description: 'Test your ML knowledge.',
      courseId: dataScienceCourse.id,
    },
  });

  const q3 = await prisma.question.create({
    data: {
      text: 'Which algorithm is used for classification?',
      isMultiple: false,
      quizId: quiz2.id,
      options: {
        create: [
          { text: 'Linear Regression' },
          { text: 'Logistic Regression' },
          { text: 'K-Means' },
          { text: 'PCA' },
        ],
      },
    },
    include: { options: true },
  });

  await prisma.question.update({
    where: { id: q3.id },
    data: { correctIds: [q3.options[1].id] },
  });

  console.log('Seed complete!');
}

main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
