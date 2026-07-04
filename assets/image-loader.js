/**
 * Sistema automático de carga de imágenes de proyectos
 * Reemplaza los mockups CSS por imágenes reales si existen
 */

const PROJECT_IMAGE_SYSTEM = {
  
  // Base path para las imágenes
  basePath: './assets',
  
  // Configuración de proyectos (sincronizado con projects.json)
  config: {
    proyectos: [
      { id: 'goiar', selector: '[data-project="goiar"]', folder: 'goiar' },
      { id: 'oterix', selector: '[data-project="oterix"]', folder: 'oterix' },
      { id: 'cooperacion', selector: '[data-project="cooperacion"]', folder: 'cooperacion' },
      { id: 'ieb', selector: '[data-project="ieb"]', folder: 'ieb' },
      { id: 'arneg', selector: '[data-project="arneg"]', folder: 'arneg' },
      { id: 'laboratorio', selector: '[data-project="laboratorio"]', folder: 'laboratorio' }
    ],
    exploracion: [
      { id: 'luna-llena', selector: '[data-project="luna-llena"]', folder: 'luna-llena' },
      { id: 'mandalas', selector: '[data-project="mandalas"]', folder: 'mandalas' }
    ]
  },

  /**
   * Verifica si una imagen existe
   */
  async imageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  },

  /**
   * Aplica imagen de cover a un proyecto
   */
  async applyCoverImage(projectCard, imagePath) {
    const exists = await this.imageExists(imagePath);
    
    if (exists) {
      const mockContainer = projectCard.querySelector('.mock-scroll, .challenge-mock');
      if (mockContainer) {
        const projectName = projectCard.querySelector('.project-name, .challenge-title')?.textContent || 'Proyecto';
        // Reemplazar mockup CSS con imagen real
        mockContainer.innerHTML = `
          <img 
            src="${imagePath}" 
            alt="Screenshot del proyecto ${projectName}"
            loading="lazy"
            decoding="async"
            style="
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: top center;
            "
          />
        `;
        console.log(`✅ Imagen cargada: ${imagePath}`);
      }
    } else {
      console.log(`⚠️ Imagen no encontrada: ${imagePath} - usando mockup CSS`);
    }
  },

  /**
   * Inicializa el sistema de imágenes
   */
  async init() {
    console.log('🖼️ Iniciando sistema de imágenes automáticas...');
    
    // Cargar proyectos profesionales
    for (const project of this.config.proyectos) {
      const card = document.querySelector(project.selector);
      if (card) {
        const imagePath = `${this.basePath}/proyectos/${project.folder}/cover.jpg`;
        await this.applyCoverImage(card, imagePath);
      }
    }

    // Cargar proyectos de exploración
    for (const project of this.config.exploracion) {
      const card = document.querySelector(project.selector);
      if (card) {
        const imagePath = `${this.basePath}/exploracion/${project.folder}/cover.jpg`;
        await this.applyCoverImage(card, imagePath);
      }
    }

    console.log('✅ Sistema de imágenes inicializado');
  }
};

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PROJECT_IMAGE_SYSTEM.init());
} else {
  PROJECT_IMAGE_SYSTEM.init();
}
