/* eslint-disable @typescript-eslint/no-explicit-any */
import toRupiah from "@develoka/angka-rupiah-js";

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,
    timeZone: 'Asia/Jakarta'
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const printReceipt = (transactionId: number, items: any, total: number, cashier_id: number, cash: number, exchange: number ) => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    const receiptTemplate = `
      <div style="text-align: center;">
        <h2>Point Coffee</h2>
        <p>Lorem ipsum 1000<br>City Index - 02025<br>Telp.: +456-468-987-02</p>
        <hr>
        <p>${formattedDate}</p>
        <p>Cashier: #${cashier_id}<br>Manager: Eric Steer<br>Transaction Code: PC${transactionId}</p>
        <hr>
        <table style="width: 100%; text-align: left;">
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item?.name}</td>
                <td>${item?.total}</td>
                <td>${toRupiah(item?.price * item?.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <hr>
        <p>Total: ${toRupiah(total)}<br/>
        Cash: ${toRupiah(cash)}<br/>
        Exchange: ${toRupiah(exchange)}</p>
        <hr>
        <p>THANK YOU!<br>Glad to see you again!</p>
      </div>
    `;

    const popupWin = window.open('', '_blank', 'width=300,height=fit-content');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 10px; max-height: fit-content }
            hr { border: 1px dashed #000; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 5px; }
            th { border-bottom: 1px solid #000; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${receiptTemplate}
        </body>
      </html>
    `);
    popupWin.document.close();
};
