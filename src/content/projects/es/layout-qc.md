---
title: "Maquetación y control de calidad, automatizados"
era: "2026"
tools: ["Macros de Word (VBA)", "Python"]
summary: "Una biblioteca que automatiza la revisión final de calidad de módulos de aprendizaje maquetados en Word — unos treinta puntos de control que se corrigen o se marcan solos y dejan a la persona solo lo que de verdad necesita un ojo humano."
order: 4
featured: true
lang: es
---

## El trabajo

Maquetar y revisar módulos de aprendizaje en Word es un trabajo exacto y repetitivo: portada, página de copyright, índice, pies de página, leyendas de figuras, encabezados, conteo de páginas — unos treinta puntos de control por módulo, cada uno un lugar donde un ojo cansado puede dejar pasar algo. El encargo era quitar lo mecánico del escritorio sin quitar el criterio de la página.

## Alcance

- **Macros de Word (VBA)** que ejecutan los controles sobre el documento abierto y corrigen lo mecánico — portadas, año de copyright, campos del índice, pies, referencias de figuras, encabezados, conteo de páginas — y reportan cada uno como aprobado, corregido o marcado.
- Un **paquete de Python**, con su propia suite de tests, para lo que es más limpio hacer sobre el archivo directamente: reescribir el campo del índice, inspeccionar los códigos de campo, validar los nombres de archivo contra la convención — en lote, sobre toda una carpeta de módulos.
- Cada ítem del checklist termina corregido o marcado, para que nada pase en silencio.

## La línea que mantiene

La automatización hace lo mecánico; el ojo humano se queda con lo que solo un ojo humano debería — la revisión visual, la consistencia editorial, la firma final. Las macros confirman que un estilo es correcto; nunca deciden si una frase se lee bien.
