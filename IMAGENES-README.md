# 📸 Sistema Automático de Imágenes de Proyectos

Este sistema reemplaza automáticamente los mockups CSS por imágenes reales cuando las agregás a las carpetas correspondientes.

## 📁 Estructura de Carpetas

```
portfolio/
├── portfolio-fernanda.html
└── assets/
    ├── image-loader.js          (script automático)
    ├── projects.json             (configuración)
    └── proyectos/
        ├── goiar/
        │   └── cover.jpg         ← Poné tu imagen acá
        ├── oterix/
        │   └── cover.jpg
        ├── cooperacion/
        │   └── cover.jpg
        ├── ieb/
        │   └── cover.jpg
        ├── arneg/
        │   └── cover.jpg
        └── laboratorio/
            └── cover.jpg
    └── exploracion/
        ├── luna-llena/
        │   └── cover.jpg
        └── mandalas/
            └── cover.jpg
```

## 🚀 Cómo Usar

### 1. **Agregar imágenes a proyectos existentes**

Simplemente copiá tu imagen (screenshot, mockup, etc.) a la carpeta del proyecto:

```bash
# Ejemplo para Goiar
cp mi-screenshot-goiar.jpg assets/proyectos/goiar/cover.jpg
```

**El portfolio se actualiza solo cuando recargás la página.**

### 2. **Agregar un proyecto nuevo**

**Paso 1:** Creá la carpeta del proyecto

```bash
mkdir assets/proyectos/mi-nuevo-proyecto
```

**Paso 2:** Agregá la imagen

```bash
cp mi-imagen.jpg assets/proyectos/mi-nuevo-proyecto/cover.jpg
```

**Paso 3:** Actualizá `assets/projects.json`

```json
{
  "proyectos": [
    // ... proyectos existentes ...
    {
      "id": "mi-nuevo-proyecto",
      "nombre": "Mi Nuevo Proyecto",
      "carpeta": "mi-nuevo-proyecto",
      "imagenes": {
        "cover": "cover.jpg"
      }
    }
  ]
}
```

**Paso 4:** Agregá el proyecto en el HTML

En `portfolio-fernanda.html`, agregá un nuevo `<a class="project-card">` con:
- `data-project="mi-nuevo-proyecto"` (mismo ID que en projects.json)
- `data-tags="tag1 tag2"` para los filtros

**Paso 5:** Actualizá `assets/image-loader.js`

Agregá el proyecto al array de configuración:

```javascript
config: {
  proyectos: [
    // ... proyectos existentes ...
    { id: 'mi-nuevo-proyecto', selector: '[data-project="mi-nuevo-proyecto"]', folder: 'mi-nuevo-proyecto' }
  ]
}
```

## 🎨 Formato de Imágenes Recomendado

- **Formato:** JPG o PNG
- **Nombre:** Siempre `cover.jpg` (o `cover.png`)
- **Resolución:** 1920x1080px mínimo
- **Peso:** Menor a 500KB (optimizá con TinyPNG o similar)
- **Aspecto:** 16:9 para proyectos grandes, 4:3 para verticales

## 🔧 Troubleshooting

### "La imagen no aparece"

1. **Verificá el nombre:** Debe ser exactamente `cover.jpg` (minúsculas)
2. **Verificá la ruta:** `assets/proyectos/[nombre-proyecto]/cover.jpg`
3. **Abrí la consola del navegador:** F12 → Console
   - Deberías ver: `✅ Imagen cargada: ./assets/proyectos/goiar/cover.jpg`
   - Si dice `⚠️ Imagen no encontrada`, revisá la ruta

### "El portfolio no se actualiza"

1. Refrescá la página con Ctrl+Shift+R (hard refresh)
2. Verificá que `image-loader.js` esté incluido en el HTML
3. Abrí la consola y buscá errores en rojo

## 📝 Notas

- **No necesitás tocar el HTML** para cambiar imágenes, solo reemplazá los archivos en `assets/`
- **Los mockups CSS se mantienen** como fallback si no hay imagen
- **El sistema es 100% automático** — solo copiá imágenes y refrescá

## 🎯 Ejemplo Rápido

```bash
# 1. Copiá tu screenshot
cp ~/Desktop/goiar-dashboard.jpg assets/proyectos/goiar/cover.jpg

# 2. Abrí el portfolio en el navegador
open portfolio-fernanda.html

# 3. ¡Listo! La imagen ya está visible
```

---

**¿Dudas?** Revisá la consola del navegador (F12) — ahí te dice si las imágenes se cargaron correctamente.
