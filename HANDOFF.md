# ONESIMOS : SESSION HANDOFF (SWEET TAPE EDITION)

**Last updated:** 2026-10-30 13:35:54 UTC
**Design Benchmark:** Sanjai Builds "Sweet Tape" Style
**Stack:** Next.js + GSAP + Lenis + React Three Fiber + Drei

---

## 1. VISION: THE SWEET TAPE STANDARD
We are moving beyond flat claymorphism. The goal is a high-fidelity, tactile, 3D world.
- **Pip the Parrot:** Moving to a React Three Fiber (R3F) 3D mesh for real clay lighting and volume.
- **Motion:** GSAP-driven scroll reveals and tactile squish interactions.
- **Scroll:** Lenis smooth scrolling (already installed).

---

## 2. CURRENT STATUS
- ✅ Unboxed Pip mounted globally in layout.
- ✅ Redundant Pip tags removed.
- ✅ Supabase Client correctly mapped to @/lib/supabaseClient.
- ✅ Production build passing at Next.js 14.2.35.
- ✅ 3D Foundations installed (three, @react-three/fiber, @react-three/drei).

---

## 3. SURGICAL TASKS
1. **Transform Pip to 3D:** Create a Pip3D component using Drei's Float and RoundedBox for that high-end clay look.
2. **Scroll Orchestration:** Implement GSAP ScrollTrigger for the landing page and dashboard reveals.
3. **Puffy UI:** Upgrade globals.css with multi-layered specular lighting (Pixar-tier).

---

## 4. HOUSE RULES
- Use git add .
- No em dashes or en dashes.
- Deliver code via surgical Node scripts.
