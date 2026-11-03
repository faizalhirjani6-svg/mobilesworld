"""Runtime regression checks for the requested phone animation sequence."""
import asyncio
import math
from pathlib import Path
from playwright.async_api import async_playwright


async def check_sequence():
    Path('/tmp/browser/phone').mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for width, height in [(360, 640), (1280, 1800)]:
            page = await browser.new_page(viewport={"width": width, "height": height})
            await page.goto("http://localhost:8080", wait_until="networkidle")
            await page.locator(".stage3d").scroll_into_view_if_needed()
            await page.wait_for_timeout(2300)

            async def seek(time):
                await page.evaluate("""time => {
                    for (const e of document.querySelectorAll('.stage3d *'))
                        for (const a of e.getAnimations()) { a.pause(); a.currentTime = time; }
                }""", time)
                await page.wait_for_timeout(50)

            async def state():
                return await page.evaluate("""() => {
                    const read = selector => getComputedStyle(document.querySelector(selector));
                    return {
                        front: read('.p3-front').transform,
                        board: read('.p3-board').opacity,
                        turn: read('.phone3d').transform,
                        path: read('.stage3d-track').transform,
                        depth: new DOMMatrixReadOnly(read('.stage3d-track').transform).m43,
                        x: new DOMMatrixReadOnly(read('.stage3d-track').transform).m41,
                        y: new DOMMatrixReadOnly(read('.stage3d-track').transform).m42,
                        yaw: parseFloat(read('.phone3d').getPropertyValue('--spin-angle')),
                        roll: parseFloat(read('.phone3d').getPropertyValue('--tumble-angle')),
                    };
                }""")

            await seek(0)
            start = await state()
            await seek(500)
            opened = await state()
            assert opened["board"] == "1", "Phone must disassemble during the first second"
            assert opened["front"] != start["front"]
            await seek(1000)
            assembled = await state()
            assert assembled["front"] == start["front"], "Phone must reassemble by one second"
            assert assembled["board"] == "0"
            radius = 70 if width == 360 else 120
            previous_yaw = start['yaw']
            for time in range(250, 8001, 250):
                await seek(time)
                sample = await state()
                angle = 2 * math.pi * time / 8000
                assert abs(sample['x'] - radius * math.sin(angle)) < .02, f'Orbit circle mismatch: {width} {time} {sample["x"]} expected {radius * math.sin(angle)}'
                assert abs(sample['depth'] - (radius * (math.cos(angle) - 1) - 45)) < .02, 'Orbit must stay only slightly farther back'
                assert sample['y'] == 0, 'Phone must tumble rather than move up and down'
                step = (sample['yaw'] - previous_yaw) % 360
                assert 10 < step < 13, 'Rotation must advance smoothly without pauses'
                previous_yaw = sample['yaw']
            await seek(4000)
            middle = await state()
            assert middle["turn"] != assembled["turn"], "Assembled phone must rotate"
            assert middle["path"] != start["path"], "Phone must glide on both screen sizes"
            assert abs(middle['depth'] + radius * 2 + 45) < .02, 'Phone must not retreat too far'
            await page.locator('.stage3d').screenshot(path=f'/tmp/browser/phone/distant-{width}.png')
            for time, low, high, pose in [(2400, 90, 100, 'sideways'), (4160, 190, 200, 'upside-down')]:
                await seek(time)
                assert low < (await state())['roll'] < high, f'Phone must turn {pose}'
                await page.locator('.stage3d').screenshot(path=f'/tmp/browser/phone/{pose}-{width}.png')
            await seek(8000)
            end = await state()
            # A complete 360-degree turn returns the same orientation.
            assert abs(end['yaw'] - start['yaw']) < .02, "Spin must finish at the starting orientation"
            assert end["depth"] == -45, "Phone must return to its slightly recessed starting position"
            await seek(8500)
            assert (await state())["board"] == "1", "Disassembly must repeat after the spin"
            await page.locator('.stage3d').screenshot(path=f'/tmp/browser/phone/sequence-{width}.png')
            print(f"{width}: continuous circular orbit, smooth 360 turn, moderate depth and repeated disassembly passed")
            await page.close()
        await browser.close()


asyncio.run(check_sequence())