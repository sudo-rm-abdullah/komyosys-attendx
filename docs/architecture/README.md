# AttendX Architecture

AttendX is prepared as five cooperating areas:

1. **Web** — React and TypeScript frontend in `apps/web`.
2. **API** — FastAPI backend foundation in `services/api`.
3. **CV** — Python computer-vision service foundation in `services/cv`.
4. **Supabase** — planned PostgreSQL/database and related services; not connected yet.
5. **Shared contracts** — reserved data definitions in `packages/contracts`.

## Development camera

`CAM-001` is the **Development Camera** using the **Laptop Webcam** as its current development/testing source only. It is not the production entrance camera. The existing web preview requests access only after an explicit user action and releases its stream when stopped or unmounted. Production camera configuration can be introduced later without treating the laptop webcam as production hardware.

The API and CV services currently provide only health endpoints. Database schemas, business APIs, and CV processing belong to later milestones.
