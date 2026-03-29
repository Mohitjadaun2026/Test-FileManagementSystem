import csv
import os

TARGET_DIR = os.path.join(os.path.dirname(__file__), 'csv')
NUM_FILES = 10000
ROWS_PER_FILE = 10

HEADER = ['tradeId', 'clientId', 'stockSymbol', 'quantity', 'price', 'tradeType']
STOCKS = ['AAPL', 'MSFT', 'TSLA', 'GOOG', 'AMZN', 'META', 'NFLX']
TRADE_TYPES = ['BUY', 'SELL']

os.makedirs(TARGET_DIR, exist_ok=True)

for i in range(1, NUM_FILES + 1):
    filename = os.path.join(TARGET_DIR, f'loadtest-{i}.csv')
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(HEADER)
        for j in range(ROWS_PER_FILE):
            trade_id = f'TRD{i:05d}{j:02d}'
            client_id = f'CLT{(i+j)%1000:03d}'
            stock = STOCKS[(i+j)%len(STOCKS)]
            quantity = (j+1)*10
            price = round(100 + (i%100) + (j*5.5), 2)
            trade_type = TRADE_TYPES[(i+j)%2]
            writer.writerow([trade_id, client_id, stock, quantity, price, trade_type])

