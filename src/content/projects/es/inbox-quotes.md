---
title: "De la bandeja a la cotización, con revisión humana"
era: "2026"
tools: ["Python", "n8n", "Streamlit"]
summary: "Correos de venta clasificados al llegar, especificaciones extraídas del texto y una cotización redactada en automático — servida en una cola de revisión donde una persona edita y envía. Ahorra tiempo y trabajo manual repetitivo; la decisión se queda con la persona."
order: 2
featured: true
lang: es
---

## El trabajo

Un equipo de ventas pequeño perdía clientes potenciales por responder tarde: cada pedido de cotización había que leerlo, entenderlo, cotizarlo y contestarlo a mano, y los que no recibían respuesta a tiempo se enfriaban. El encargo era quitar la lectura y la redacción del escritorio de la persona — sin dejar que ninguna respuesta automática saliera sin que alguien la viera.

## Cómo funciona

- Cada correo se **clasifica al llegar** — pedido de cotización estándar, trabajo a medida, un seguimiento que alguien espera o spam — así la cola queda ordenada antes de que alguien la abra.
- Se **extraen las especificaciones** del cuerpo: qué quiere el cliente y, igual de importante, qué dejó por fuera. Un parser determinista resuelve los campos del formulario web; el modelo de lenguaje lee solo el texto libre.
- Cuando el pedido está completo, el sistema **calcula la cotización y redacta la respuesta completa**. Cuando falta algo, el borrador pide exactamente los datos que faltan — por su nombre, en el mismo hilo del cliente.
- El spam no genera borrador y se recomienda archivar.

## Un escritorio de revisión, no un piloto automático

Nada se envía solo. Cada borrador llega a una **interfaz de revisión** hecha para la única persona que atiende la bandeja — una cola de tarjetas, cada una con la clasificación, los datos extraídos y un borrador editable para leer, ajustar y enviar. El sistema hace la lectura y el primer borrador; la persona se queda con la decisión y con la voz.
