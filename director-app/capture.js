import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

    for (let i = 3; i <= 5; i++) {
        await page.goto(`http://localhost:3000/test/${i}`, { waitUntil: 'networkidle' });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: `/Users/zeeshanmalik/.gemini/antigravity/brain/f43adbb1-167a-4450-a4f3-327abac47487/slide_${i}_test.png` });
        console.log(`Saved slide_${i}_test.png`);
    }

    await browser.close();
})();
