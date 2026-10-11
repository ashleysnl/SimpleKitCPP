# SimpleKitCPP development

## SimpleKit V2 source workflow

- V2 development occurs on `develop-v2`. Synchronize that branch before work; keep `main`, production hosting and DNS unchanged until separately authorized release.
- This source is bundled at an immutable SHA by `ashleysnl/simplekit-site`; preserve calculator IDs, formulas, persistence, exports, canonical URLs and analytics. Shared V2 components live in SimpleKit-Core.
- Follow the site’s V2 roadmap and owner’s implementation-first cadence: inspect source changes and build each coherent batch; defer exhaustive numerical/state, SEO, accessibility and browser checks to Phase 16. Record implementation as pending verification until those checks pass.
