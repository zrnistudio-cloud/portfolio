# 🚀 Guía de Optimización y Deployment

## ✅ Optimizaciones YA Aplicadas

### **SEO & Meta Tags**
- ✅ Meta description optimizada
- ✅ Open Graph tags (Facebook/LinkedIn)
- ✅ Twitter Cards
- ✅ JSON-LD structured data
- ✅ Keywords relevantes
- ✅ Favicon SVG dinámico

### **Performance**
- ✅ Lazy loading en imágenes
- ✅ Font preconnect para Google Fonts
- ✅ CSS optimizado con variables
- ✅ Animaciones con `will-change`
- ✅ Smooth scroll con respeto a `prefers-reduced-motion`

### **Accesibilidad**
- ✅ Alt text descriptivo en imágenes
- ✅ Contraste de colores AA compliant
- ✅ Navegación por teclado funcional
- ✅ Cursor custom deshabilitado en mobile
- ✅ Respeta preferencias de animación reducida

---

## 📦 Próximos Pasos Recomendados

### 1. **Crear imagen Open Graph**
Necesitás una imagen `og-image.jpg` (1200x630px) para que se vea bien cuando compartas en redes:

```
assets/og-image.jpg
```

**Qué debería tener:**
- Tu nombre grande
- "UX UI Lead · Product Designer"
- Fondo con tu paleta de colores (negro + verde lima)
- Opcional: mockup de uno de tus proyectos

### 2. **Minificar CSS/JS** (opcional, para producción)

**Herramientas online:**
- CSS: https://cssminifier.com/
- JS: https://javascript-minifier.com/

O usá este comando si tenés Node.js:
```bash
npx terser assets/image-loader.js -o assets/image-loader.min.js
```

Luego actualizá el HTML para usar `.min.js`

### 3. **Optimizar imágenes**

Cuando agregues tus screenshots:
- Formato: WebP (mejor que JPG)
- Resolución: 1920x1080px máximo
- Peso: < 300KB cada una

**Herramientas:**
- https://tinypng.com/ (online)
- https://squoosh.app/ (online, convierte a WebP)

### 4. **Deployment en GitHub Pages** (GRATIS)

**Paso 1:** Creá un repo en GitHub
```bash
git init
git add .
git commit -m "Portfolio inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/portfolio.git
git push -u origin main
```

**Paso 2:** Activá GitHub Pages
1. Andá a Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / root
4. Save

**Tu portfolio estará en:** `https://TU_USUARIO.github.io/portfolio/`

### 5. **Dominio Custom** (opcional)

Si compraste un dominio (ej: `fernandajuarez.design`):

**En GitHub:**
- Settings → Pages → Custom domain → ponés tu dominio

**En tu proveedor de dominio:**
- Agregás un registro CNAME apuntando a `TU_USUARIO.github.io`

---

## 🎨 Mejoras Visuales Opcionales

### **Agregar transiciones de página**
Si querés hacer el portfolio multi-página, podés usar:
- [Barba.js](https://barba.js.org/) para transiciones suaves
- [Swup](https://swup.js.org/) para page transitions

### **Agregar micro-animaciones**
- [GSAP](https://greensock.com/gsap/) para animaciones complejas
- [Lottie](https://airbnb.io/lottie/) para animaciones exportadas de After Effects

### **Analytics** (para trackear visitas)
Agregá Google Analytics 4:
```html
<!-- En el <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔧 Performance Checklist

Antes de hacer deploy, verificá:

- [ ] Todas las imágenes pesan < 500KB
- [ ] Usaste WebP en lugar de JPG/PNG
- [ ] El portfolio carga en < 3 segundos
- [ ] Testeaste en mobile (responsive)
- [ ] Testeaste en Chrome, Firefox, Safari
- [ ] Los links externos tienen `target="_blank" rel="noopener"`
- [ ] El portfolio funciona sin JavaScript (graceful degradation)

**Herramientas para testear:**
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- Lighthouse en Chrome DevTools (F12 → Lighthouse)

---

## 📱 Testeo Mobile

Abrí Chrome DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)

Testeá en:
- iPhone 12 Pro (390x844)
- iPad Air (820x1180)
- Samsung Galaxy S20 (360x800)

---

## 🎯 Objetivo de Performance

**Métrica ideal:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s

Tu portfolio ya está optimizado para lograr esto si las imágenes están bien comprimidas.

---

¿Dudas? Todo lo necesario ya está aplicado en el HTML. Solo falta deployment! 🚀
