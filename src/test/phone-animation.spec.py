"""Runtime regression checks for the requested phone animation sequence."""
import asyncio
from playwright.async_api import async_playwright


async def check_sequence():
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

            async def state():
                return await page.evaluate("""() => {
                    const read = selector => getComputedStyle(document.querySelector(selector));
                    return {
                        front: read('.p3-front').transform,
                        board: read('.p3-board').opacity,
                        turn: read('.phone3d').transform,
                        path: read('.stage3d-track').transform,
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
            await seek(2500)
            middle = await state()
            assert middle["turn"] != assembled["turn"], "Assembled phone must rotate"
            assert middle["path"] != start["path"], "Phone must glide on both screen sizes"
            await seek(4000)
            end = await state()
            # A complete 360-degree turn returns the same orientation.
            assert end["turn"] == start["turn"], "Spin must finish at the starting orientation"
            await seek(4500)
            assert (await state())["board"] == "1", "Disassembly must repeat after the spin"
            await page.locator('.stage3d').screenshot(path=f'/tmp/browser/phone/sequence-{width}.png')
            print(f"{width}: one-second disassembly/reassembly, gliding full turn, repeated disassembly passed")
            await page.close()
        await browser.close()


asyncio.run(check_sequence())