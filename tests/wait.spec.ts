import { test } from "@playwright/test";

test('Inbuilt Wait Usage', async ({ page }) => {

    await page.waitForTimeout(10000);

})

test('SetTimeout Wait Usage', async ({ page }) => {

    async function wait(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    await wait(10000)

})