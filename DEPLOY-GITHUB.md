# 🚀 Deployment a GitHub Pages — Paso a Paso

## ✅ **Pre-requisitos:**
- Tener Git instalado
- Tener cuenta de GitHub
- Repo ya creado: https://github.com/zrnistudio-cloud/portfolio

---

## 📦 **Paso 1: Pushear el portfolio**

Abrí la terminal en la carpeta de tu portfolio y ejecutá:

```bash
# 1. Ir a la carpeta del portfolio
cd /ruta/a/tu/portfolio

# 2. Inicializar Git (si no lo hiciste)
git init

# 3. Agregar todos los archivos
git add .

# 4. Hacer commit
git commit -m "Portfolio multi-página completo con 7 proyectos"

# 5. Renombrar branch a main
git branch -M main

# 6. Conectar con GitHub
git remote add origin https://github.com/zrnistudio-cloud/portfolio.git

# 7. Pushear todo
git push -u origin main
```

**Si te pide autenticación:**
- Usuario: tu username de GitHub
- Password: usa un **Personal Access Token** (no tu password)

**Cómo crear un Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Selecciona `repo` → Generate
3. Copiá el token y usalo como password

---

## ⚙️ **Paso 2: Activar GitHub Pages**

1. Andá a: **https://github.com/zrnistudio-cloud/portfolio/settings/pages**

2. En **Source**, seleccioná:
   - Branch: **main**
   - Folder: **/ (root)**
   - Click **Save**

3. **Esperá 2-3 minutos**

4. Tu portfolio estará en:
   ```
   https://zrnistudio-cloud.github.io/portfolio/
   ```

5. Refrescá la página de Settings → Pages para ver el link verde confirmando el deploy

---

## 🔍 **Verificación:**

Una vez que esté live, verificá:

- ✅ Home carga correctamente
- ✅ Proyectos se abren al hacer click
- ✅ Imágenes se ven
- ✅ Botón "Volver" funciona
- ✅ Dark/Light mode funciona
- ✅ Filtros de proyectos funcionan

---

## 🐛 **Troubleshooting:**

### **Error: "remote: Repository not found"**
- Verificá que el repo existe en GitHub
- Verificá que tenés permisos de escritura

### **Error: "failed to push some refs"**
```bash
# Pull primero si hay cambios remotos
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### **Las imágenes no se ven en GitHub Pages**
- Verificá que las rutas sean relativas: `../assets/proyectos/ieb/01.jpg`
- NO uses rutas absolutas: `/assets/proyectos/ieb/01.jpg`
- Las imágenes deben estar pusheadas al repo

### **El sitio no se actualiza**
- Esperá 2-3 minutos después de cada push
- Limpiá caché del navegador (Ctrl+Shift+R)
- Verificá en Actions (tab Actions en GitHub) que el deploy terminó

---

## 🔄 **Actualizar el portfolio después:**

Cuando hagas cambios (agregar imágenes, editar contenido):

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

GitHub Pages se actualiza automáticamente en 2-3 minutos.

---

## 🎨 **Opcional: Dominio custom**

Si tenés un dominio propio (ej: `fernandajuarez.design`):

1. En tu proveedor de dominio, agregá:
   - Tipo: **CNAME**
   - Host: **www** (o @)
   - Value: **zrnistudio-cloud.github.io**

2. En GitHub → Settings → Pages → Custom domain:
   - Poné tu dominio: `fernandajuarez.design`
   - Save
   - Esperá propagación DNS (puede tardar hasta 24hs)

---

¡Listo! Tu portfolio estará live en minutos 🚀
