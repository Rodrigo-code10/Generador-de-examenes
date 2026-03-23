#  Generador de Exámenes con IA (Gemini)

Aplicación web desarrollada con **Next.js** que permite a los usuarios generar exámenes personalizados a partir de un tema utilizando inteligencia artificial (Gemini).  
Incluye autenticación, gestión de usuarios, historial de exámenes y pruebas automatizadas end-to-end con Playwright.

---

##  Tecnologías utilizadas

-  Next.js 16 (App Router)
-  TypeScript
-  PostgreSQL
-  Prisma ORM
-  Playwright (testing E2E)
-  Gemini AI (generación de preguntas)
-  Tailwind CSS

---

##  Funcionalidades principales

- Registro de usuarios
- Inicio de sesión
- Perfil de usuario
- Generación de exámenes mediante IA
- Visualización de preguntas
- Continuación de exámenes
- Historial de intentos
- Cierre de sesión
- Pruebas automatizadas

---

##  Flujo de la aplicación

1. El usuario se registra o inicia sesión  
2. Accede al dashboard (`/api`)  
3. Ingresa a su perfil (`/api/users`)  
4. Genera un examen con Gemini (`/api/generate`)  
5. Responde el examen (`/api/questions?id=...`)  
6. Visualiza resultados o continúa exámenes  

---

## Rutas principales

| Ruta | Descripción |
|------|------------|
| `/api/login` | Inicio de sesión |
| `/api/register` | Registro |
| `/api` | Dashboard principal |
| `/api/users` | Perfil del usuario |
| `/api/generate` | Generar examen con IA |
| `/api/questions?id=...` | Resolver examen |

---

##  Pruebas automatizadas (Playwright)

Se implementaron pruebas end-to-end que validan el flujo completo de la aplicación:

### ✔ Pruebas incluidas

- Registro de usuario  
- Inicio de sesión  
- Generación de examen con IA  
- Cierre de sesión  

###  Ejecutar pruebas

```bash
npx playwright test --headed
