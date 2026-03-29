# Use absolute path for the csv directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$TargetDir = Join-Path $ScriptDir "csv"
$NumFiles = 10000
$RowsPerFile = 10
$Header = "tradeId,clientId,stockSymbol,quantity,price,tradeType"
$Stocks = @("AAPL", "MSFT", "TSLA", "GOOG", "AMZN", "META", "NFLX")
$TradeTypes = @("BUY", "SELL")

if (!(Test-Path $TargetDir)) { New-Item -ItemType Directory -Path $TargetDir | Out-Null }

for ($i = 1; $i -le $NumFiles; $i++) {
    $filename = Join-Path $TargetDir ("loadtest-$i.csv")
    Set-Content -Path $filename -Value $Header
    for ($j = 0; $j -lt $RowsPerFile; $j++) {
        $tradeId = ("TRD{0:D5}{1:D2}" -f $i, $j)
        $clientId = ("CLT{0:D3}" -f (($i+$j)%1000))
        $stock = $Stocks[($i+$j)%$Stocks.Count]
        $quantity = ($j+1)*10
        $price = [math]::Round(100 + ($i%100) + ($j*5.5), 2)
        $tradeType = $TradeTypes[($i+$j)%2]
        Add-Content -Path $filename -Value "$tradeId,$clientId,$stock,$quantity,$price,$tradeType"
    }
}
