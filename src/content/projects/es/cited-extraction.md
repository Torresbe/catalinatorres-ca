---
title: "Del documento sin estructura al checklist auditable"
era: "2026"
tools: ["Python", "n8n", "Power Platform"]
summary: "Un workflow que convierte un informe denso y sin estructura en una lista de acciones verificable: la IA solo extrae lo que puede citar palabra por palabra, reglas deterministas deciden y una persona revisa lo que queda en duda."
order: 1
featured: true
lang: es
---

## El trabajo

Un informe de auditoría de seguridad ocupacional llega como un PDF denso. Alguien tiene que convertirlo en quién necesita qué formación y para cuándo. El riesgo no está en la lectura — está en la invención. Una automatización que devuelve un hallazgo que el documento nunca contuvo es peor que no tener automatización. Así que el encargo se definió solo: extraer únicamente lo que el documento dice, demostrarlo y dejar la decisión en manos de una persona.

## Cómo funciona

- El modelo de lenguaje extrae cada hallazgo **citando la fuente palabra por palabra** — no parafrasea y no inventa hallazgos.
- Cada cita se **verifica contra el documento**: si la frase citada no está realmente ahí, se marca. Esa verificación es el candado anti-alucinación — un hallazgo inventado no puede llegar a una decisión.
- **Reglas deterministas** asignan a cada hallazgo verificado la formación que le corresponde y un plazo según la severidad. Mismo input, mismo resultado, siempre.
- Para lo que las reglas no cubren, una capa **RAG** — retrieval-augmented generation, búsqueda semántica sobre el catálogo de cursos — propone la coincidencia más cercana. Nunca decide sola: propone y el caso pasa a revisión humana.
- Todo lo que queda en duda llega a un **paso de revisión**, para que una persona lo apruebe antes de que algo sea definitivo.

El principio se sostiene en todo el sistema: la IA cita, las reglas deciden, la persona aprueba.

## Construido para correr en cualquier plataforma

El mismo workflow, construido de tres formas:

- **n8n + Python** — n8n orquesta el flujo; Python lleva la lógica de control y la verificación de las citas.
- **n8n nativo** — todo dentro de n8n, sin Python, incluido el **agente RAG** que recupera del catálogo por búsqueda semántica.
- **Power Platform** — el mismo resultado reconstruido en la nube de Microsoft, sobre un entorno montado desde cero.

Distintas herramientas, el mismo resultado. El criterio nunca estuvo en la herramienta.
