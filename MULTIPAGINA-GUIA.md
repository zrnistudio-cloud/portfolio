# 🚀 Portfolio Multi-Página — Guía Completa

## ✅ Lo que ya está listo:

- `index.html` → Home con grid de proyectos (todos los links funcionan)
- `proyectos/ieb.html` → Template IEB+ completo
- `proyectos/delosbarcos.html` → Template De los Barcos completo
- Carpetas de assets creadas para todos los proyectos
- Sistema de cursor custom
- Navegación "← Volver" funcional

---

## 📋 Proyectos pendientes de crear:

### **Layout Simple (copiar de ieb.html y cambiar contenido):**

1. **topdoctor.html**
2. **bikeing.html**
3. **arneg.html**
4. **laboratorio.html**
5. **holaquetal.html**

### **Case Studies Completos (estructura diferente):**

1. **goiar.html** → El más elaborado
2. **cooperacion.html** → Completo
3. **oterix.html** → Completo

### **Exploración:**

1. **exploracion/luna-llena.html** → Completo
2. **exploracion/mandalas.html** → Completo

---

## 🎯 Cómo crear los proyectos faltantes (Layout Simple):

### **Paso 1: Copiar template**
```bash
cd proyectos
cp ieb.html topdoctor.html
```

### **Paso 2: Editar contenido**
Abrir `topdoctor.html` y cambiar:

**Línea 6 (title):**
```html
<title>Top Doctor — María Fernanda Juárez</title>
```

**Líneas 110-135 (hero):**
```html
<h1 class="project-title">TopDoctors</h1>
<p class="project-description">
  Challenge. Trabajé en la mejora de la experiencia digital para pacientes y profesionales de la salud dentro de la plataforma Top Doctors. Trabajé en la optimización de flujos clave como la reserva de turnos, visualización de perfiles médicos y carga de documentación clínica. Diseñé interfaces responsivas y accesibles en Figma, y validé soluciones mediante prototipos interactivos y test de usabilidad con usuarios reales.
</p>
<div class="project-tags">
  <span class="tag">Benchmark</span>
  <span class="tag">Research</span>
  <span class="tag">Arquitectura de la Información</span>
  <span class="tag">Prototipado</span>
  <span class="tag">Design System</span>
</div>
```

**Líneas 140+ (galería):**
```html
<div class="project-image">
  <img src="../assets/proyectos/topdoctor/01.jpg" alt="Top Doctor Screenshot 1" loading="lazy" />
</div>
```

### **Repetir para:**
- `bikeing.html`
- `arneg.html`
- `laboratorio.html`
- `holaquetal.html`

---

## 📸 Contenido de cada proyecto:

### **Top Doctor**
**Título:** TopDoctors  
**Descripción:** Challenge. Trabajé en la mejora de la experiencia digital para pacientes y profesionales de la salud dentro de la plataforma Top Doctors. Trabajé en la optimización de flujos clave como la reserva de turnos, visualización de perfiles médicos y carga de documentación clínica. Diseñé interfaces responsivas y accesibles en Figma, y validé soluciones mediante prototipos interactivos y test de usabilidad con usuarios reales.  
**Tags:** Benchmark, Research, Arquitectura de la Información, Prototipado, Design System

---

### **Bikeing**
**Título:** Bikeing App  
**Descripción:** Diseñé una aplicación mobile enfocada en brindar seguridad, comunidad y seguimiento de rutas para ciclistas urbanos. El proyecto abarcó todo el proceso de diseño: investigación de usuarios, definición de arquetipos, ideación de funcionalidades clave, wireframes y prototipo interactivo en Figma. Validé el flujo mediante test con usuarios y apliqué principios de accesibilidad y diseño centrado en el usuario.  
**Tags:** Benchmark, Research, Arquitectura de la Información, Prototipado, Entrevista con Usuarios

---

### **ARNEG**
**Título:** ARNEG CRM  
**Descripción:** Participé junto al equipo de Mangoodev en el rediseño integral del sistema CRM de Arneg, enfocándome en mejorar la experiencia de usuario y la eficiencia operativa. El trabajo incluyó investigación con usuarios, diseño de flujos, wireframes y prototipos interactivos. El resultado fue una interfaz más intuitiva y coherente, alineada con los objetivos del negocio y las necesidades reales de los usuarios.  
**Tags:** Research, UX Design, UI Design, Prototyping, B2B

---

### **Laboratorio MX**
**Título:** Laboratorio MX / CRM  
**Descripción:** Diseñé un CRM para gestión comercial y relaciones con clientes en un laboratorio farmacéutico. Realicé benchmarks del sector, definí flujos de usuario y construí prototipos en Figma en un entorno ágil. Foco especial en la curva de aprendizaje del usuario interno.  
**Tags:** UX Research, Pharma, Agile, CRM Design

---

### **Hola que tal**
**Título:** Hola, que tal! / Bootcamp  
**Descripción:** Challenge. Diseñé una aplicación mobile que fomenta conexiones entre profesionales dentro del entorno laboral durante la pausa del mediodía. A través de una experiencia intuitiva y cálida, la app permite coordinar almuerzos, encuentros breves y actividades compartidas entre colegas o personas de distintas áreas. El proyecto incluyó investigación cualitativa, definición de perfiles de usuario, diseño de flujos, wireframes y prototipo validado con usuarios reales.  
**Tags:** Benchmark, Research, Prototipado, Design System

---

## 🎨 Estructura de imágenes:

Cada proyecto debe tener sus imágenes en:
```
assets/proyectos/[nombre-proyecto]/
├── 01.jpg
├── 02.jpg
├── 03.jpg
└── ...
```

Las imágenes se cargarán automáticamente en la galería.

---

## 🔥 Agregar Barba.js (Transiciones suaves):

**Paso 1:** Descargar Barba.js
```bash
# En la carpeta assets/
curl -o barba.min.js https://unpkg.com/@barba/core@2.9.7/dist/barba.umd.js
```

**Paso 2:** Agregar al HTML (antes de `</body>`):
```html
<script src="../assets/barba.min.js"></script>
<script>
  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.5
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0,
          duration: 0.5
        });
      }
    }]
  });
</script>
```

---

## ✅ Checklist:

- [ ] Crear archivos HTML de proyectos faltantes
- [ ] Actualizar index.html con proyecto "Hola que tal"
- [ ] Agregar imágenes a carpetas de assets
- [ ] Probar navegación entre páginas
- [ ] Implementar Barba.js (opcional)
- [ ] Pushear a GitHub

---

¿Querés que continúe creando todos los archivos HTML o preferís hacerlo vos siguiendo esta guía?
