# CLAUDE SKILLS — YP Strategic Research

## Overview
This directory contains reusable skills and patterns developed throughout the YP Strategic Research platform. These are production-tested, optimized code snippets and comprehensive guides for building advanced financial intelligence systems.

---

## Available Skills

### 🌍 Global Stock Intelligence Globe

**Files:**
- `global-stock-globe.md` — Complete implementation guide (21KB)
- `globe-utils.ts` — Reusable utility library (12KB)

**What It Does:**
Creates an interactive 3D Earth globe visualization that displays:
- Company headquarters with live stock prices
- Animated supply chain/correlation flow lines
- Geopolitical risk zones with real-time updates
- Orbital rings for multi-layer data visualization
- Real-time stock data integration (5-second refresh)

**Key Features:**
```
✓ Three.js sphere with realistic Earth rendering
✓ Fresnel atmospheric glow shader
✓ Canvas-based procedural heat maps
✓ Sprite-based ticker labels with live updates
✓ Animated particle flows along supply chain lines
✓ Risk zones with pulsing danger indicators
✓ Interactive drag-to-rotate + mouse wheel zoom
✓ 60fps performance target with GPU acceleration
```

**Use This For:**
- Financial intelligence dashboards
- Geopolitical risk mapping
- Supply chain visualization
- Global operations tracking
- Real-time market intelligence
- Defence-tech industry analysis
- Institutional flow visualization

**Quick Start:**
```typescript
import { initializeGlobe } from '@/lib/globe-utils'

const globe = initializeGlobe(container, {
  backgroundColor: 0x000000,
  autoRotate: true,
  dataUpdateInterval: 5000,
})

// Add companies, risk zones, flow lines
globe.addFlowLine(company1, company2, 0.85)
globe.addRiskZone(taiwanStraitZone)

// Cleanup
globe.dispose()
```

**Color Palette (Reference):**
- Neon Green (text): #00ff88
- Electric Blue (positive): #0088ff
- Blood Red (critical): #ff0055
- Deep Orange (warning): #ff8800
- Gold (highlights): #ffff00

---

## How to Use These Skills

### 1. Reference During Development
When building similar features, reference the relevant skill guide:
```bash
# Read the guide
cat .claude/skills/global-stock-globe.md

# Copy the utility library to your project
cp .claude/skills/globe-utils.ts app/lib/
```

### 2. Copy & Customize
The utility library (`globe-utils.ts`) is designed to be:
- **Modular:** Functions work independently
- **Configurable:** All parameters are customizable
- **Extensible:** Easy to add new features
- **Type-safe:** Full TypeScript support

### 3. Learn Best Practices
The guide includes:
- **Architecture decisions:** Why layered rendering works best
- **Performance tips:** Optimization strategies (LOD, frustum culling, etc.)
- **Troubleshooting:** Common issues and solutions
- **GLSL shaders:** Copy-paste ready code
- **Data structures:** Interfaces for companies, risk zones, etc.

---

## Skill Development Log

### Global Stock Intelligence Globe (2026-03-25)
**Status:** Production-Ready
**Lines of Code:** 2,100+ (guide + library)
**Time to Implement:** ~40 hours (first time), ~2 hours (with skill)
**Optimization Level:** ⭐⭐⭐⭐ (GPU-accelerated, 60fps)
**Reusability Score:** ⭐⭐⭐⭐⭐ (drop-in library)

**What Works:**
- Real-time stock price integration
- Supply chain flow visualization
- Risk zone rendering
- Interactive globe controls
- Performance optimization
- Mobile responsiveness (ready)

**What's Future:**
- WebGL2 advanced shaders
- Post-processing (bloom, DOF)
- VR/AR integration
- Historical timeline replay
- Sound design integration
- Multi-user synchronization

---

## Creating New Skills

When adding a new skill to this project:

1. **Create the implementation** in the main codebase
2. **Test thoroughly** (functional + performance tests)
3. **Document extensively** in Markdown:
   - Architecture overview
   - Code snippets with explanations
   - Best practices
   - Troubleshooting guide
4. **Create a utility library** in TypeScript
   - Modular functions
   - Type-safe interfaces
   - Reusable across projects
5. **Add to this README** with quick reference
6. **Commit with descriptive message**

---

## Related Skills (Planned)

- [ ] Real-Time Data Pipeline Architecture
- [ ] Canvas 2D Heat Map Generation
- [ ] GLSL Shader Programming Guide
- [ ] React Three.js Integration Patterns
- [ ] WebSocket Real-Time Data Streaming
- [ ] Performance Monitoring with stats.js
- [ ] Three.js Material & Texture Optimization
- [ ] Interactive Data Visualization Patterns

---

## Quick Links

**Documentation:**
- Three.js: https://threejs.org/docs/
- WebGL: https://www.khronos.org/webgl/
- Earth Textures: NASA Blue Marble (public domain)

**Performance Tools:**
- stats.js: Frame rate monitoring
- Chrome WebGL Debugger: Shader inspection
- Lighthouse: Performance auditing

**Related Projects:**
- Chainalysis (cryptocurrency tracking)
- Planet Labs (satellite imagery)
- Bloomberg Terminal (financial data)
- Palantir Gotham (intelligence ops)

---

## Notes

- These skills are maintained and updated as the platform evolves
- All code is production-tested in the YP Strategic Research platform
- Skills follow the same code standards and styling guidelines as the main project
- Performance targets: 60fps on modern hardware, <5s load time
- Mobile-first design approach with graceful degradation

---

## Contact

For questions about these skills or to suggest improvements:
- Check the GitHub issues: github.com/diaznehemiah91-svg/yp-strategic/issues
- Review the skill documentation for detailed explanations
- Test locally before adapting to your project

**Last Updated:** 2026-03-25
**Skill Version:** 1.0.0 (Production)
