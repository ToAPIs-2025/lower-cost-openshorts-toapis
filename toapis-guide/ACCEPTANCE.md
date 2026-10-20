# Validation boundary

- This is a real fork with upstream source/history/license preserved. The independent guide and original optional adapter live under toapis-guide/.
- integration/toapis-image-adapter.mjs follows the pinned src/adapters/types.ts ImageGenerationAdapter/GeneratedAsset shape. It is not automatically registered into OpenShorts or agency-orchestrator (AO).
- Start the authenticated loopback bridge, then call createToAPIsImageAdapter with a stable runId, separate bridge token and absolute output directory. Unsupported seed/transparency/negative-prompt settings fail before submission.
- The module was exercised over loopback HTTP against three saved real PNGs, reading actual PNG dimensions and checking unsupported options. This was a no-cost replay check.
- The Seedance clip can be reused as an original media asset. AO provider registration, voiceover, subtitles and full movie rendering remain pending; the tool's own audio features are not ToAPIs claims.

No full upstream UI acceptance, native video/reference editing acceptance or audio acceptance is claimed. Check cases.json for API output and billing evidence.
