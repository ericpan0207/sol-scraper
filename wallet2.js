const puppeteer = require('puppeteer'); 

(async () => { 
    // Initiate the browser 
    const browser = await puppeteer.launch({headless: "new"}); 
    
    const walletAddress = 'B8YLuoLpeJcCX2mY9d6RdKzimNBEdXVQmNxtzPC7fZPd';
    const TIMEOUT = 5000;
    // Create a new page with the default browser context 
    const page = await browser.newPage(); 
  
    // Go to the target website 
    await page.goto(`https://solscan.io/account/${walletAddress}#splTransfer`); 
 
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
        const availOptions = await options[3]?.isVisible()
        if (availOptions) {
            await options[3].click()
        }
    }
   
    // Wait for the table to appear on the page
    const tableSelector = '#rc-tabs-0-panel-splTransfer table tbody tr'; 
	  await page.waitForSelector(tableSelector, {timeout: TIMEOUT});

    // Grab Table data
    const data = await page.$$eval('#rc-tabs-0-panel-splTransfer table tbody tr',  rows => {
        const lastRow = rows[rows.length - 1]

        // return Array.from(rows, row => {
          const columns = lastRow.querySelectorAll('td');
          return Array.from(columns, column => column.innerText);
        // });
      });
    
    console.log(data[3])
    

    // Grab # of txns
    await page.waitForSelector('span.ant-typography.ant-typography-secondary', {timeout: TIMEOUT})
    let txns = await page.$$('span.ant-typography.ant-typography-secondary');
    txns = txns.pop()
    txns = await txns.getProperty('innerText');
    txns = await txns.jsonValue();
    txns = txns.split(' ')
    
    console.log(txns[txns.length - 2])
      
    await page.waitForSelector('.ant-col.ant-col-16', {timeout: TIMEOUT})
    let solBalance = await page.$('.ant-card-body > .ant-row > .ant-col.ant-col-16')
    solBalance = await solBalance.getProperty('innerText');
    solBalance = await solBalance.jsonValue();

    console.log(solBalance)

    // Closes the browser and all of its pages 
    await browser.close(); 
})();