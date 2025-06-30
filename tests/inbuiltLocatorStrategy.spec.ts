import { expect, test } from "@playwright/test";

test('Locator', async ({page})=> {
    await page.goto('https://www.w3schools.com/html/html_tables.asp');
    const getTable = await page.locator('(//tbody)[1]');
    const getRowByCompanyName = getTable.locator('tr', {hasText: 'Ernst Handel'});
    console.log(`LENGTH ${await getRowByCompanyName}`);
    const getAllCompanyName = await getRowByCompanyName.locator('(td)[3]').textContent();
    console.log(`Company Name ${getAllCompanyName}`)
})