# INSTRUCCIONES MAESTRAS DE EJECUCIÓN PARA GOOGLE ANTIGRAVITY
## Proyecto: Plataforma Web E-Commerce & Visor 3D "Maternidad 3D" (Edición Dark Luxury)

Este archivo contiene toda la especificación técnica, rutas de activos locales y arquitectura para que el agente de **Google Antigravity** construya la aplicación web completa de principio a fin dentro de esta carpeta.

---

## 1. ACTIVOS LOCALES YA DISPONIBLES EN ESTA CARPETA

El agente de Antigravity debe utilizar y copiar a `/public` los siguientes archivos que ya existen en este directorio sincronizado:

1. **Modelos 3D Optimizados con Compresión Draco (Carpeta `./Modelos 3D/`):**
   - `./Modelos 3D/Madre.glb` (**294 KB** — Malla optimizada del torso materno; requiere `DRACOLoader` en Three.js y material de cristal/resina ahumada translúcida `MeshPhysicalMaterial`).
   - `./Modelos 3D/bebe.glb` (**176 KB** — Malla optimizada del bebé a partir de ecografía 3D; requiere `DRACOLoader` y material mate cálido tono piel `MeshStandardMaterial` posicionado dentro de la cavidad ventral de la madre).

2. **Catálogo de Imágenes de Referencia (Carpeta `./Imagenes De Referencia/`):**
   - `./Imagenes De Referencia/00_Imagen_Referencia_Principal.png` (**Imagen Insignia Principal**: Escultura en resina translúcida ahumada sobre fondo negro puro con perfil materno mirando al vientre y feto iluminado en su interior).
   - `./Imagenes De Referencia/01_Prototipo_Resina_Traslucida_Frontal.png` (Vista frontal en resina esmerilada con base negra).
   - `./Imagenes De Referencia/02_Prototipo_Resina_Traslucida_Perspectiva.png` (Vista en ángulo 3/4).
   - `./Imagenes De Referencia/03_Variacion_Resina_Negra_Obsidiana.png` (Variación en resina negra alto brillo).
   - `./Imagenes De Referencia/04_Variacion_Resina_Ahumada_Grafito.png` (Variación en resina ahumada grafito).
   - `./Imagenes De Referencia/05_Variacion_Bronce_Escultorico_Patinado.png` (Variación en bronce clásico patinado).

---

## 2. DIRECCIÓN DE ARTE Y ESTÉTICA OBLIGATORIA ("DARK LUXURY GALLERY")

- **Base Negra Absoluta:** La página web debe tener un estética nocturna de galería de lujo con fondo negro profundo (`#050505` y `#0a0a0c`), haciendo que la escultura 3D y las imágenes con fondo negro se fundan de manera invisible y elegante con la página.
- **Paleta de Colores:**
  - Fondo Principal: `#050505` (Negro galería)
  - Superficies / Tarjetas: `#0f1117` con bordes sutiles `rgba(255, 255, 255, 0.08)` y efecto *glassmorphism*
  - Acento Principal (Luz LED / Dorado Maternal): `#d97706` / `#f59e0b` (Ámbar cálido dorado)
  - Texto Principal: `#f8fafc` (Blanco cálido) y `#94a3b8` (Gris plata para subtítulos)
- **Propósito Emocional ("Por qué nació esto"):** Inmortalizar la etapa más sagrada y efímera de la vida —el embarazo— transformando las ecografías 3D/4D/5D (que antes quedaban en papel térmico que se borra o en un USB olvidado) en una escultura física eterna del primer abrazo intrauterino.

---

## 3. CATÁLOGO OFICIAL DE 3 PRODUCTOS (PRECIOS VALIDADOS BOGOTÁ 2026)

La web debe presentar 3 niveles de producto (*Tiers*) con selector interactivo conectado al estado global:

1. **Producto 1 — "Esencia Gestacional" (Tier de Entrada):**
   - **Precio Oficial:** **$249.000 COP** *(Bono de lanzamiento web: $220.000 COP)*.
   - **Qué incluye:** Figura de la madre con silueta genérica estilizada en resina traslúcida/ahumada + **Bebé 100% personalizado** esculpido a partir de la ecografía 3D de la mamá + Base plana de soporte estándar (sin luz).
   - **Público:** Autocompra accesible para tener al bebé real en las manos.

2. **Producto 2 — "Luz de Vida" (Tier Intermedio / BEST SELLER):**
   - **Precio Oficial:** **$369.000 COP** *(Promo lanzamiento: $350.000 COP)* — **3 cuotas sin interés de $123.000 COP con Addi / Sistecredito**.
   - **Qué incluye:** Figura de la madre genérica en resina óptica traslúcida + **Bebé 100% personalizado de la ecografía 3D** + **Base con Luz LED Cálida Integrada (USB-C e interruptor táctil)** que ilumina la escultura desde abajo en la oscuridad, convirtiéndola en una lámpara conmemorativa mágica para el cuarto del bebé.
   - **Público:** El favorito para regalos grupales ("vaca") de Baby Shower (6 amigos aportando $61.500 COP c/u) y abuelos primerizos.

3. **Producto 3 — "Maternidad Total" (Tier de Autor / Ultra-Personalizado):**
   - **Precio Oficial:** **$690.000 COP** (vía guía fotográfica desde casa) | **$780.000 COP** (con sesión de escaneo 3D presencial en Bogotá).
   - **Qué incluye:** **Escultura de la madre 100% personalizada a la forma y silueta real de la mamá embarazada** + **Bebé 100% personalizado de la ecografía 3D** + Base de lujo con Luz LED táctil + Placa metálica grabada en láser con nombre y semanas de gestación + Caja rígida magnética con espuma EVA a medida.
   - **Rol Psicológico:** Edición de colección para estratos 5 y 6 y ancla de valor para potenciar las ventas del Tier 2.

---

## 4. ESPECIFICACIÓN DEL VISOR 3D INTERACTIVO (THREE.JS + DRACO)

Crear el componente `SculptureViewer3D.tsx` con `@react-three/fiber` y `@react-three/drei` (o Three.js puro) que cargue simultáneamente `/models/Madre.glb` y `/models/bebe.glb` usando `useGLTF` con soporte Draco (`https://www.gstatic.com/draco/versioned/decoders/1.5.7/`):

- **Material de `Madre.glb`:** `MeshPhysicalMaterial` con `color: '#2a2d34'`, `transmission: 0.88`, `opacity: 1`, `transparent: true`, `roughness: 0.14`, `ior: 1.46`, `thickness: 1.2`, `envMapIntensity: 1.5` (aspecto de cristal ahumado idéntico a `00_Imagen_Referencia_Principal.png`).
- **Material de `bebe.glb`:** `MeshStandardMaterial` con `color: '#eab68c'`, `roughness: 0.55`, `metalness: 0.05` (tono piel cálido suave).
- **Simulador Interactivo de Base con Luz LED:**
  - Incluir un botón prominente en la interfaz del visor: **`[ ✨ Encender Base Luz LED ]`**.
  - Al activarlo, animar una `PointLight` ámbar (`#ff9d2e`, `intensity: 4.5`, `distance: 3`) ubicada en la base inferior de la escultura y añadir un halo sutil a los pies del modelo, mostrando en tiempo real cómo luce el **Tier 2 y Tier 3** cuando se apaga la luz de la habitación.

---

## 5. FACILIDADES DE PAGO Y CHECKOUT DE ALTA CONVERSIÓN

En el módulo de pedido y subida de ecografía (`OrderUploaderModal.tsx`):
1. **Drag & Drop de Ecografía:** Permitir subir imágenes (`.jpg`, `.png`), videos 4D (`.mp4`) o volúmenes médicos (`.dcm`, `.zip`). Si el usuario elige el **Tier 3**, habilitar el campo adicional para subir las 4 fotos guiadas de la silueta de la mamá.
2. **Selector de Modalidad de Pago sin Fricción:**
   - **Opción 1: Pago 50% / 50% (Confianza Total):** Paga solo el 50% hoy para iniciar el modelado en Blender y el 50% restante cuando apruebes el render 3D de tu bebé por WhatsApp antes de imprimir.
   - **Opción 2: 3 Cuotas sin Interés (Addi / Sistecredito):** Muestra automáticamente el valor dividido en 3 cuotas mensuales.
   - **Opción 3: "Hacer Vaca para Baby Shower":** Genera un resumen listo para compartir en WhatsApp con el grupo de amigos o compañeros de oficina dividendo el valor entre 5 o 6 personas.
