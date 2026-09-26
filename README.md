# SITIIO — sitio web

Aplicación de producción de SITIIO (Next.js · React · TypeScript).
La referencia visual oficial es el prototipo aprobado:
[`docs/reference/sitiio-prototype.html`](docs/reference/sitiio-prototype.html). **El diseño está congelado**:
cualquier cambio visual debe compararse contra ese archivo.

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run start      # sirve el build
npm run lint
npx tsc --noEmit   # chequeo de tipos
```

## Estructura

```
src/
  app/                 Rutas (App Router), metadata, robots, sitemap, íconos
  animations/          Motor de scroll y escenas (lógica pura en TS)
    engine.ts            Un único requestAnimationFrame para toda la página
    story/               Hero → esfera → laptop → proyectos (timeline + escena)
    servicesScene.ts · processScene.ts · finalScene.ts · navScene.ts
  components/
    brand/               Logo (esfera) y wordmark
    layout/              Navbar, Loader, SiteFooter, RevealObserver
    projects/            Mini-webs de cada proyecto + tarjetas flotantes
  config/              Datos del negocio (site.ts) y navegación
  data/                Proyectos, servicios y pasos del proceso
  hooks/               useScene (conecta una sección con su escena)
  sections/home/       Secciones de la Home (Server Components)
  styles/              CSS global + Home + estilos por proyecto (orden = cascada del prototipo)
public/
  fonts/               Tipografías auto-alojadas (woff2, subset latin)
  images/branding/     Logo oficial
docs/reference/        Prototipo aprobado y logo original
```

### Cómo funciona la animación

Las secciones se renderizan en el servidor. Cada una monta un pequeño
componente cliente que registra su **escena** en el motor (`src/animations/engine.ts`).
El motor usa un solo `requestAnimationFrame`, suaviza únicamente el valor que
leen las animaciones (el scroll nativo nunca se bloquea) y duerme cuando no hay
nada que animar. Cada escena separa lecturas de layout (`read`) de escrituras
(`render`) para evitar *layout thrashing*.

No se usa GSAP: la coreografía aprobada es una función determinista del scroll
y se portó 1:1 desde el prototipo para no alterar su timing.

### Agregar un proyecto al showcase

1. Añadir su entrada en `src/data/projects.ts` (el orden define la historia).
2. Crear su mini-web y tarjetas en `src/components/projects/<slug>/` y
   registrarlas en `src/components/projects/registry.ts`.
3. Añadir `src/styles/projects/<slug>.css` e importarlo en `src/styles/home.css`.

La línea de tiempo, los colores del escenario, el contador y el indicador se
recalculan solos.

### Datos del negocio

WhatsApp, correo, dirección, servicios y redes viven en `src/config/site.ts`.
El enlace de WhatsApp se genera con `whatsappUrl()`.

## Variables de entorno

Ver `.env.example`. Ninguna es secreta.
