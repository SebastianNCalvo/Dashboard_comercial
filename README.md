🚀 Dashboard Comercial - Sistema de Gestión Integral
Este proyecto es una plataforma SaaS (Software as a Service) diseñada para optimizar la administración de locales comerciales. El sistema centraliza la operativa diaria, desde el control de inventario en tiempo real hasta la gestión de postventa, permitiendo a los comerciantes tomar decisiones basadas en datos precisos.

Shutterstock
Explorar

💡 Funcionalidades Principales
El sistema está construido para cubrir el ciclo completo de vida de una venta:

Gestión de Inventario Dinámico: Control de stock con actualizaciones automáticas. Cada venta o devolución dispara funciones en la base de datos que ajustan el inventario al instante.

Gestión de Postventa y Trazabilidad: Módulo especializado para procesar cambios y devoluciones, manteniendo una relación directa con la venta original mediante identificadores únicos.

Sistema de Notas de Crédito y Vales: Automatización del flujo financiero post-venta, permitiendo generar comprobantes de crédito de forma sencilla y eficiente.

Reportes y Gastos: Seguimiento de gastos operativos y métricas financieras para visualizar la rentabilidad del negocio.

Autenticación y Seguridad: Implementación de roles de usuario para asegurar que cada vendedor tenga acceso solo a las funciones necesarias.

🛠 Arquitectura Tecnológica
El proyecto utiliza un stack moderno y escalable:

Frontend: Desarrollado con React.js y Vite, asegurando una interfaz rápida y reactiva.

Estilos: Implementación de interfaces limpias y modernas mediante Tailwind CSS.

Backend & Base de Datos: Supabase (PostgreSQL) como motor central.

Lógica de Negocio: Uso de Triggers y Procedimientos Almacenados (PL/pgSQL) en la base de datos para garantizar la integridad referencial y el cálculo automático de inventarios sin sobrecargar el frontend.

Documentación: Integración de jsPDF para la generación dinámica de comprobantes de cambio y notas de crédito.

🚀 Instalación y Puesta en Marcha
Para ejecutar este proyecto localmente, sigue estos pasos:

Clonar el repositorio:

Bash
git clone https://github.com/tu-usuario/dashboard-comercial.git
cd dashboard-comercial
Instalar dependencias:

Bash
npm install
Configurar variables de entorno:
Crea un archivo .env en la raíz con las credenciales de tu proyecto de Supabase:

Fragmento de código
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
Ejecución:

Bash
npm run dev
📊 Modelo de Datos
La arquitectura se basa en una estructura relacional altamente normalizada:

ventas_cabecera / ventas_detalle: Captura la transacción madre y sus ítems asociados.

productos: Catálogo central con restricciones de stock.

cambios_registros / devoluciones: Entidades vinculadas a la venta original para mantener auditoría histórica.

🤝 Contribuciones
Este proyecto está en desarrollo activo. Si deseas contribuir, por favor abre un Issue o envía un Pull Request.

Desarrollado con pasión para la gestión comercial moderna.