# GUÍA DE DIRECCIÓN ARTÍSTICA Y DISEÑO WEB — MATERNIDAD 3D
**Referente Principal:** [Bridal Bliss](https://www.bridalbliss.com/)  
**Referencias Complementarias:** [Sunday in Brooklyn](https://www.sundayinbrooklyn.com/private-events/) · [Tartine Bakery](https://tartinebakery.com/) · [Bathhouse](https://bathhouse.com/) · [Aston Martin Configurator](https://media.astonmartin.com/aston-martin-unveils-new-configurator-that-sets-the-standard-for-automotive-digital-products/?lang=eng)

---

## 1. Filosofía Visual: Por Qué Bridal Bliss Define el Alma de Maternidad 3D

Una escultura prenatal de ultrasonido 3D es una **reliquia familiar profundamente emotiva** que celebra la llegada de un hijo. El diseño anterior cayó en tres síntomas típicos de plantillas generadas por IA: negro absoluto (`#000000`) con acentos en naranja fosforescente, sobrecarga de párrafos técnicos y botones toscos de interfaz mecánica (*"RAYOS-X CAVIDAD"*, *"CALIBRAR"*).

Al tomar a **[Bridal Bliss](https://www.bridalbliss.com/)** como columna vertebral, la página adopta el lenguaje del **Editorial Romántico Atemporal**: luz natural cálida, fondos en crema alabastro y lino, tipografía Serif con cursivas expresivas, fotografías en proporción vertical de revista (4:5) y calma visual.

| Referente Web | Peso en el Diseño | Elementos Exactos que Adoptamos en Maternidad 3D |
| :--- | :--- | :--- |
| **[Bridal Bliss](https://www.bridalbliss.com/)** *(Referente Principal)* | **60% — Alma Editorial y Layout** | Fondos claros en alabastro (`#FAF7F2`) y lino (`#F2ECE1`). Titulares Serif con palabras clave en *cursiva*. Fotografías verticales (4:5) con amplios márgenes en blanco. Enlaces limpios con flecha fina (`Descubrir más →`) en vez de botones neón. |
| **[Sunday in Brooklyn](https://www.sundayinbrooklyn.com/private-events/)** | **10% — Hospitalidad y Ediciones** | Tono cálido, cercano y familiar. Presentación de las 3 ediciones como colecciones conmemorativas, no como tablas de software B2B. |
| **[Tartine Bakery](https://tartinebakery.com/)** | **10% — Oficio Artesanal** | Estética de libro de arte impreso. Énfasis en el trabajo hecho a mano en Bogotá, la pureza de la resina pulida y la textura táctil. |
| **[Bathhouse](https://bathhouse.com/)** | **10% — Santuario Nocturno 3D** | Uso de piedra obsidiana cálida (`#1A1715`) y bronce tenue exclusivamente en el bloque del Visor 3D para que la luz LED cálida de 2700K resplandezca en una atmósfera de santuario. |
| **[Aston Martin](https://media.astonmartin.com/aston-martin-unveils-new-configurator-that-sets-the-standard-for-automotive-digital-products/?lang=eng)** | **10% — Ingeniería 3D Invisible** | Rotación orbital fluida a 60 FPS sobre `Madre.glb` y `bebe.glb`, con controles casi invisibles integrados en la estética editorial. |

---

## 2. Sistema Cromático Oficial (Adiós al Negro Puro y al Neón)

Queda prohibido el negro puro (`#000000`), el gris frío (`#111827`) y el naranja saturado (`#FF8800`).

| Token CSS | Nombre Artístico | Código HEX | Aplicación Específica |
| :--- | :--- | :--- | :--- |
| `--bg-ivory` | Alabastro Cálido | `#FAF7F2` | Fondo principal (80% de la web: Navbar, Hero, Intro, Proceso, Footer). |
| `--bg-linen` | Lino Travertino | `#F2ECE1` | Fondo secundario para alternar secciones (Colección de 3 Ediciones y Galería). |
| `--bg-sanctuary` | Obsidiana Bathhouse | `#1A1715` | Exclusivo para el contenedor del Visor 3D (hace brillar la luz cálida 2700K). |
| `--text-espresso` | Espresso Carbón | `#2C2825` | Titulares Serif y textos principales sobre fondos claros (sustituye al negro). |
| `--text-taupe` | Piedra Taupe | `#6E665E` | Párrafos breves, subtítulos y leyendas de galería. |
| `--accent-champagne` | Oro Champán Mate | `#8C6D46` | Líneas finas de `1px`, flechas editoriales, micro-etiquetas y bordes activos. |
| `--accent-sage` | Salvia Oliva Suave | `#5C6458` | Detalles secundarios y etiquetas de entrega artesanal. |

---

## 3. Tipografía Editorial y Ley de Silencio Visual (Anti-Sobrecarga)

1. **Titulares (Display Serif):** `Cormorant Garamond` o `Playfair Display` (pesos `300 Light` y `400 Regular`), combinando redonda con palabras clave en *cursiva (italic)* para transmitir ternura maternal (ej. *"El primer abrazo, esculpido en luz y calma"*).
2. **Cuerpo y Navegación (Clean Sans):** `Plus Jakarta Sans` o `Montserrat` (pesos `300` y `400`).
3. **Micro-etiquetas Superiores (Eyebrows):** `11px`, mayúsculas sostenidas (`uppercase`), espaciado amplio (`letter-spacing: 0.22em`), color `#8C6D46`.
4. **Límite Estricto de 25 Palabras por Párrafo:** Se elimina el 75% del texto actual. Ningún bloque de texto supera las 2.5 líneas. Cero viñetas técnicas sobre archivos DICOM o degradación química del papel térmico.

---

## 4. Estructura Detallada Sección por Sección

### 4.1. Barra de Navegación Editorial
- Fondo translúcido en crema alabastro (`rgba(250, 247, 242, 0.92)`) con borde inferior `1px solid #E5DEC9`.
- Izquierda: `MATERNIDAD 3D` en Serif. Centro: `EL ATELIER` · `ESTUDIO 3D` · `COLECCIÓN` · `PROCESO`. Derecha: Botón de borde fino `1px solid #2C2825` (`ENCARGAR OBRA`).

### 4.2. Hero Section: Emoción Maternal a Primera Vista
- Fondo `#FAF7F2` con grilla asimétrica de 2 columnas y generoso espacio negativo (`45%` de aire).
- **Izquierda:** Etiqueta `ATELIER ESCULTÓRICO · BOGOTÁ`, titular en Cormorant Garamond (`56px`): *"El primer abrazo con tu bebé, esculpido en luz y calma"*, una sola frase de 22 palabras y un enlace editorial limpio: `EXPLORAR LA COLECCIÓN ———→`.
- **Derecha:** Fotografía principal (`00_Imagen_Referencia_Principal.png`) en proporción vertical 4:5 con pie de foto en cursiva.

### 4.3. Bloque Introductorio (Estilo Bridal Bliss)
- Sobre fondo lino `#F2ECE1`, título centrado en tres líneas (*"Memoria Tangible, Oficio Artesanal, Luz Maternal"*), un párrafo corto de dos líneas y dos imágenes verticales en composición asimétrica.

### 4.4. Santuario Interactivo 3D (Fusión Bathhouse + Aston Martin)
- Marco arquitectónico centrado en color obsidiana cálida (`#1A1715`) rodeado de márgenes alabastro.
- Visor Three.js con `Madre.glb` y `bebe.glb`.
- Sin botones naranjas ni etiquetas como *"RAYOS-X"* o *"CALIBRAR"*. Solo tres selectores circulares discretos (`Cristal Ahumado`, `Esmerilado Seda`, `Bronce`) y un switch limpio: `Luz Cálida 2700K`.

### 4.5. Las Tres Ediciones Conmemorativas (Galería Editorial)
- Sobre fondo `#F2ECE1`, 3 columnas limpias con fotografía vertical superior, título en Serif, valor oficial, 2 líneas poéticas y enlace `Seleccionar edición →`:
  1. **I. Esencia Gestacional ($249.000 COP / Lanzamiento $220.000):** Silueta materna translúcida con la anatomía real de tu bebé esculpida desde su ecografía 3D.
  2. **II. Luz de Vida — Edición Insignia ($369.000 COP / Lanzamiento $350.000):** Incluye pedestal artesanal con luz LED cálida de 2700K que ilumina suavemente el vientre.
  3. **III. Maternidad Total ($690.000 COP / Escaneo $780.000):** Escultura única a medida tanto de la silueta real de la madre como del bebé.

---

## 5. Prompt Maestro para Copiar y Pegar en Google Antigravity

```markdown
# REDISEÑO RADICAL: ESTÉTICA EDITORIAL "BRIDAL BLISS" & WARM ATELIER

Desecha por completo el diseño oscuro actual (parece una plantilla genérica de IA con fondo negro #000000, botones naranjas neón y exceso de texto). Rediseña toda la aplicación web siguiendo estrictamente la dirección artística de https://www.bridalbliss.com/ combinada con la calidez artesanal de Tartine Bakery y un bloque de santuario arquitectónico estilo Bathhouse para el visor 3D.

1. PALETA DE COLOR OBLIGATORIA (VARIABLES CSS / TAILWIND):
- Fondo Principal (80% de la web): Alabastro Cálido `#FAF7F2` (nada de fondos negros en la página general).
- Fondo Secundario (Alternancia de secciones): Lino Travertino `#F2ECE1`.
- Texto Principal y Titulares: Espresso Carbón `#2C2825` (PROHIBIDO usar negro puro `#000000`).
- Texto Secundario (Párrafos): Piedra Taupe `#6E665E`.
- Acentos Editoriales: Oro Champán Mate `#8C6D46` y líneas divisorias sutiles `#E5DEC9`.
- Fondo Exclusivo del Contenedor del Visor 3D: Obsidiana Cálida `#1A1715` (solo dentro del marco de la sección 3D para que resalte la luz cálida de 2700K del vientre).

2. TIPOGRAFÍA EDITORIAL (GOOGLE FONTS):
- Importa `Cormorant Garamond` (pesos 300, 400, 500, normal e italic) para todos los encabezados (`h1`, `h2`, `h3`). Usa palabras en *italic* dentro de los títulos para dar delicadeza maternal.
- Importa `Plus Jakarta Sans` o `Montserrat` (pesos 300, 400, 500) para cuerpo de texto y navegación.
- Subtítulos superiores (eyebrows): `11px`, `uppercase`, `tracking-[0.22em]`, color `#8C6D46`.

3. REGLA ESTRICTA DE REDUCCIÓN DE TEXTO (ELIMINAR EL 75% DEL TEXTO ACTUAL):
- Elimina todos los párrafos largos, las listas con checks sobre degradación química del papel térmico, archivos DICOM y las tablas de precios saturadas de cálculos.
- Ningún párrafo en toda la web puede tener más de 25 palabras.
- Deja como mínimo un 45% de espacio en blanco (espacio negativo) alrededor de las imágenes y textos, con `py-28` o `py-32` entre secciones.

4. REDISEÑO DE COMPONENTES CLAVE:
- Navbar: Fondo `#FAF7F2/90` con `backdrop-blur-sm`, borde inferior `1px solid #E5DEC9`, enlaces limpios y botón de línea fina `1px solid #2C2825` (cero botones rellenos de naranja).
- Hero Section: Fondo claro `#FAF7F2`, layout asimétrico de 2 columnas. A la izquierda: título en Cormorant Garamond ("El primer abrazo con tu bebé, *esculpido en luz y calma*"), una frase de 20 palabras y un enlace de texto con línea fina `DESCUBRIR LA OBRA ———→`. A la derecha: fotografía principal en proporción vertical 4:5 con marco limpio.
- Santuario 3D (`Madre.glb` y `bebe.glb`): Enmarca el visor Three.js dentro de una sección con bordes suaves en color `#1A1715`. Elimina botones como "RAYOS-X", "CALIBRAR" o bordes naranjas. Deja únicamente 3 selectores discretos de material (Cristal Ahumado, Esmerilado Seda, Bronce) y un switch suave "Luz Nocturna 2700K".
- Colección (Las 3 Ediciones): Sobre fondo `#F2ECE1`, 3 columnas limpias estilo revista editorial con foto vertical arriba, título en Serif (`Esencia Gestacional $249.000`, `Luz de Vida $369.000`, `Maternidad Total $690.000`), 2 líneas de descripción poética y un enlace `Seleccionar edición →`.
```
