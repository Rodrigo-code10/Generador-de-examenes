import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando el seeding...')

  console.log('Limpiando base de datos...')
  await prisma.answer.deleteMany()
  await prisma.attemptQuestion.deleteMany()
  await prisma.attempt.deleteMany()
  await prisma.option.deleteMany()
  await prisma.question.deleteMany()
  await prisma.user.deleteMany()

  console.log('Creando usuario administrador...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Cargando banco de preguntas...')
  const questions = [
    // --- JAVASCRIPT ---
    {
      questionText: "¿Cuál es el tipo de dato de 'null' en JavaScript?",
      topic: "JavaScript",
      options: [
        { text: "Object", Correct: true },
        { text: "Null", Correct: false },
        { text: "Undefined", Correct: false },
        { text: "String", Correct: false },
      ]
    },
    {
      questionText: "¿Cuál de estos métodos crea un nuevo array con los resultados de la llamada a la función indicada?",
      topic: "JavaScript",
      options: [
        { text: ".forEach()", Correct: false },
        { text: ".map()", Correct: true },
        { text: ".filter()", Correct: false },
        { text: ".push()", Correct: false },
      ]
    },
    {
      questionText: "¿Qué operador se utiliza para comparar tanto valor como tipo de dato?",
      topic: "JavaScript",
      options: [
        { text: "==", Correct: false },
        { text: "===", Correct: true },
        { text: "=", Correct: false },
        { text: "!=", Correct: false },
      ]
    },

    // --- REACT ---
    {
      questionText: "¿Qué hook se usa para manejar efectos secundarios en React?",
      topic: "React",
      options: [
        { text: "useState", Correct: false },
        { text: "useEffect", Correct: true },
        { text: "useContext", Correct: false },
        { text: "useReducer", Correct: false },
      ]
    },
    {
      questionText: "¿Cuál es la función principal de las 'props' en React?",
      topic: "React",
      options: [
        { text: "Almacenar estados internos", Correct: false },
        { text: "Pasar datos de componente padre a hijo", Correct: true },
        { text: "Manejar eventos globales", Correct: false },
        { text: "Modificar el DOM directamente", Correct: false },
      ]
    },
    {
      questionText: "¿Cómo se llama el entorno donde se ejecutan los componentes de React antes de actualizar el DOM real?",
      topic: "React",
      options: [
        { text: "Shadow DOM", Correct: false },
        { text: "Virtual DOM", Correct: true },
        { text: "Buffer DOM", Correct: false },
        { text: "Draft DOM", Correct: false },
      ]
    },

    // --- GIT ---
    {
      questionText: "¿Qué comando se usa para inicializar un proyecto de Git?",
      topic: "Git",
      options: [
        { text: "git start", Correct: false },
        { text: "git init", Correct: true },
        { text: "git remote", Correct: false },
        { text: "git setup", Correct: false },
      ]
    },
    {
      questionText: "¿Qué comando se usa para descargar cambios del repositorio remoto sin fusionarlos?",
      topic: "Git",
      options: [
        { text: "git pull", Correct: false },
        { text: "git fetch", Correct: true },
        { text: "git commit", Correct: false },
        { text: "git push", Correct: false },
      ]
    },

    // --- CSS ---
    {
      questionText: "¿Cuál de estos no es un framework de CSS?",
      topic: "CSS",
      options: [
        { text: "Tailwind", Correct: false },
        { text: "Bootstrap", Correct: false },
        { text: "Next.js", Correct: true },
        { text: "Bulma", Correct: false },
      ]
    },
    {
      questionText: "¿Qué propiedad de CSS se usa para cambiar el color de fondo?",
      topic: "CSS",
      options: [
        { text: "color", Correct: false },
        { text: "background-color", Correct: true },
        { text: "bgcolor", Correct: false },
        { text: "fill", Correct: false },
      ]
    },
    {
      questionText: "¿En Flexbox, qué propiedad alinea los elementos a lo largo del eje principal?",
      topic: "CSS",
      options: [
        { text: "align-items", Correct: false },
        { text: "justify-content", Correct: true },
        { text: "display", Correct: false },
        { text: "flex-direction", Correct: false },
      ]
    }
  ]

  for (const q of questions) {
    await prisma.question.create({
      data: {
        questionText: q.questionText,
        topic: q.topic,
        options: {
          create: q.options 
        }
      }
    })
  }

  console.log('Base de datos poblada con éxito. ¡Ya puedes jugar!')
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })