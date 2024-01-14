const puppeteer = require('puppeteer'); 

(async () => { 
    // Initiate the browser 
    const browser = await puppeteer.launch({headless: "new"}); 
    
    const walletAddress = '2Fcm8Z3wxjcwjhXiS3mSXeHQY62TYHhNK65zExFWPE6d';
    const TIMEOUT = 5000;
    // Create a new page with the default browser context 
    const page = await browser.newPage(); 
  
    // Go to the target website 
    await page.goto(`https://solscan.io/account/${walletAddress}#splTransfers`); 
 
    // Wait for the pagination selector to show up
    await page.waitForSelector('#rc_select_1', {timeout: TIMEOUT});

    // Locate the pagination selector
    const dropdownInput = await page.$('#rc_select_1');

    const clickable = await dropdownInput.isVisible()

    if (clickable) {
        // Click to focus on the input (opens the dropdown)
        await dropdownInput.click();

        // Wait for options to show up
        await page.waitForSelector('.ant-select-item.ant-select-item-option', {timeout: TIMEOUT})

        // Grab dropdown options and select the 4th (50)
        const options = await page.$$('.ant-select-item.ant-select-item-option');
        await options[3].click()
    }
   
    // Wait for the table to appear on the page
    const tableSelector = '#rc-tabs-0-panel-splTransfers table tbody tr'; 
	  await page.waitForSelector(tableSelector, {timeout: TIMEOUT});

    // Grab Table data
    const data = await page.$$eval('#rc-tabs-0-panel-splTransfers table tbody tr',  rows => {
        return Array.from(rows, row => {
          const columns = row.querySelectorAll('td');
          return Array.from(columns, column => column.innerText);
        });
      });
    console.log(data)
    
    // Closes the browser and all of its pages 
    await browser.close(); 
})();