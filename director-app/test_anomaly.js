const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/test/4');
    await page.waitForTimeout(1000);
    await page.getByText('Drilling Anomaly Detection').click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/Users/zeeshanmalik/.gemini/antigravity/brain/f43adbb1-167a-4450-a4f3-327abac47487/slide_4_anomaly.png' });

    // Test Refinery Yield too
    await page.getByText('Refinery Yield Optimization').click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/Users/zeeshanmalik/.gemini/antigravity/brain/f43adbb1-167a-4450-a4f3-327abac47487/slide_4_yield.png' });

    await browser.close();
})();
