# Lower-cost OpenShorts image and video guide

A local-first short-video pipeline with reusable media assets.

[中文](README_zh-CN.md) · [Model & pricing](https://go2v.toapis.com/1020_os_g) · [Upstream](https://github.com/jnMetaCode/openshorts)

**Independent ToAPIs community guide, not an upstream-endorsed edition.** This validates API cases and configuration/module boundaries; full upstream product acceptance is pending.

## Demo

![Images and case prices](screenshots/en/image-cases.png)

[![Video preview](examples/video-preview.jpg)](examples/seedance-2.mp4)

[▶ Open the original video](examples/seedance-2.mp4)

Video parameters: seedance-2 · 480p · 4s requested / 4.04s decoded · 16:9 · generate_audio=false · first-frame I2V.

Confirmed video cost: $0.26676 / clip · $0.06602970297029702970297029703/s (this case).

## Case amounts and model rates (ascending)

2026-10-20.

| Model / preset | Type | Case amount / quote | Applicable model rate | Fee evidence |
|---|---|---:|---|---|
| gpt-image-2(VIP)<br>low / 1K | image | Quoted $0.0019 | $0.0019/image | Configured rate; task billing unavailable |
| gpt-image-2<br>1K | image | Quoted $0.015 | $0.015/image | Configured rate; task billing unavailable |
| gpt-image-2.5-flare<br>high / 1K | image | Quoted $0.0225 | $0.0225/image | Configured rate; task billing unavailable |
| seedance-2<br>480p / 4.04s / no audio | video | $0.26676 | $6.571429/1M total tokens | API billing=settled |

gpt-image-2(VIP) starts at $0.0019/image; this low/1K case is $0.0019/image. Images retain quote labels when task billing is unavailable. Three image models use the same project prompt with different quality presets. Video USD/s is a measured case ratio, not a fixed tariff.

## Project-specific reuse

1. This is a real fork with upstream source/history/license preserved. The independent guide and original optional adapter live under toapis-guide/.
2. integration/toapis-image-adapter.mjs follows the pinned src/adapters/types.ts ImageGenerationAdapter/GeneratedAsset shape. It is not automatically registered into OpenShorts or agency-orchestrator (AO).
3. Start the authenticated loopback bridge, then call createToAPIsImageAdapter with a stable runId, separate bridge token and absolute output directory. Unsupported seed/transparency/negative-prompt settings fail before submission.
4. The module was exercised over loopback HTTP against three saved real PNGs, reading actual PNG dimensions and checking unsupported options. This was a no-cost replay check.
5. The Seedance clip can be reused as an original media asset. AO provider registration, voiceover, subtitles and full movie rendering remain pending; the tool's own audio features are not ToAPIs claims.

## Run the independent API cases

```powershell
$env:TOAPIS_API_KEY="your_private_key"
python run_case.py --job jobs/gpt-image-2-vip.json
python run_case.py --job jobs/gpt-image-2-vip.json --live
python run_case.py --job jobs/video.json
python run_case.py --job jobs/video.json --live
```

Without --live, only the current key rate is queried. Set a budget locally; the recipe enforces per-request caps, not a hosted-account global spend limit. After errors/timeouts, reconcile the saved task before another submission.

## Optional synchronous compatibility bridge

```powershell
$env:BRIDGE_TOKEN="replace_with_a_separate_random_token_at_least_24_chars"
$env:BRIDGE_PORT="8769"
python bridge.py
```

Binds to 127.0.0.1 only. UI credentials use the separate bridge token. Keep the real generation key in the bridge environment. Preserve upstream outbound/SSRF rules; this is not a public hosted-service endpoint. Image edits are not enabled.

## Original inputs and outputs

```text
An original cinematic educational-video still: a handcrafted miniature wooden windmill on a grassy island beside a clear stream, morning dew, small reeds and stones, soft sunrise, precise tactile textures, friendly nature-documentary aesthetic, clear single composition, 16:9 landscape, no text, no logos, no watermark.
```

[Jobs](jobs/) · [Original media](examples/) · [Sanitized evidence](evidence/) · [Acceptance](ACCEPTANCE.md) · [Upstream and protocol evidence](UPSTREAM.md)

## License and scope

Original guide/adapter code: MIT. Upstream source and trademarks keep their own license and ownership. The OpenShorts fork retains its upstream MIT license. No existing sponsor/referral links were replaced. No audio integration claim is made.
