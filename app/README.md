## Levantar Base de datos en /BD-PostgreSQL
```bash
docker compose up -d
```

## Instala dependencias en /app
```bash
npm install
```

## Configuración de Base de Datos (Prisma)

### Ejecuta Migraciones Iniciales
```bash
npx prisma migrate dev --name init
```

### Ejecuta el seed.ts para caragar datos iniciales a la BD
```bash
npx prisma db seed
```



## Gestión Visual de Datos
### Ver la base de datos visualmente
```bash
npx prisma studio
```
Accede en: [http:localhost:5555](http:localhost:5555) 




## Inicia Servidor de Desarrollo
### Corre aplicacion de Next.js
```bash
npm run dev
```

Accede en: [http://localhost:3000](http://localhost:3000)





## Algunos importantes
### Validacion de datos de esquemas de datos
```bash
npm installl zod
```

### Uso de api para la IA de Gemini

```bash
npm install @google/generative-ai
```


