# ✅ Checklist de Verificación - Portfolio Multi-Página

## 🎯 **Verificar que todo funcione:**

### **1. Navegación básica**
- [ ] Abrí `index.html` en el navegador
- [ ] Hacé click en cada proyecto del grid
- [ ] Verificá que te lleve a la página correcta
- [ ] Click en "← Volver" te devuelve al home

### **2. Imágenes cargadas correctamente**

#### **Layout Simple (deberían verse las imágenes):**
- [ ] IEB+ → `proyectos/ieb.html`
- [ ] De los Barcos → `proyectos/delosbarcos.html`
- [ ] Top Doctor → `proyectos/topdoctor.html`
- [ ] Bikeing → `proyectos/bikeing.html`
- [ ] ARNEG → `proyectos/arneg.html`
- [ ] Laboratorio MX → `proyectos/laboratorio.html`
- [ ] Hola que tal → `proyectos/holaquetal.html`

**¿Cómo verificar?**
1. Abrí cada página
2. Scrolleá hacia abajo
3. Las imágenes deberían cargar (no ver el fondo gris vacío)

#### **Estructura de archivos esperada:**
```
assets/proyectos/
├── ieb/
│   ├── 01.jpg
│   ├── 02.jpg
│   └── 03.jpg (o más)
├── delosbarcos/
│   ├── 01.jpg
│   ├── 02.jpg
│   └── 03.jpg
├── topdoctor/
│   ├── 01.jpg
│   ├── 02.jpg
│   └── 03.jpg
└── ... (resto de proyectos)
```

### **3. Placeholders (deberían decir "próximamente"):**
- [ ] Goiar → Muestra "Case study completo próximamente"
- [ ] Cooperación → Muestra "Case study completo próximamente"
- [ ] OTERIX → Muestra "Case study completo próximamente"
- [ ] Luna Llena → Muestra "Case study completo próximamente"
- [ ] Mandalas → Muestra "Case study completo próximamente"

---

## 🐛 **Troubleshooting:**

### **Si las imágenes NO se ven:**

**Problema 1: Nombres de archivo incorrectos**
- Las imágenes DEBEN llamarse: `01.jpg`, `02.jpg`, `03.jpg`, etc.
- Verificá que no sean: `01.JPG` (mayúsculas) o `image-01.jpg`

**Problema 2: Carpeta incorrecta**
- Las imágenes deben estar en: `assets/proyectos/[nombre]/`
- NO en: `assets/[nombre]/` o `proyectos/[nombre]/`

**Problema 3: Extensión incorrecta**
- Si tus imágenes son `.png`, cambiá en el HTML:
  ```html
  <img src="../assets/proyectos/ieb/01.png" ... />
  ```

### **Si la navegación no funciona:**
- Verificá que `index.html` esté en la raíz
- Verificá que las carpetas `proyectos/` y `exploracion/` estén al mismo nivel que `index.html`

---

## 📸 **Siguiente paso:**

Una vez que verificaste que todo funciona:

1. **Agregá más imágenes** si querés (04.jpg, 05.jpg, etc.)
2. **Testeá en mobile** (responsive)
3. **Pushear a GitHub**

---

## 🚀 **¿Querés que desarrolle ahora los Case Studies Completos?**

Los proyectos que todavía son placeholders:
- **Goiar** → El más importante
- **Cooperación Seguros**
- **OTERIX**
- **Luna Llena**
- **Mandalas**

Estos tendrán estructura completa con:
- Overview (problema, solución, rol)
- Proceso (research, decisiones de diseño)
- Resultados (métricas, impacto)
- Galería de imágenes más grande

**¿Empezamos con Goiar o Cooperación?** 🎨
