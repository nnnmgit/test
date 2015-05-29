var http = require('http');

// createServerメソッドを実行
http.createServer(function (req, res) {

  // HTTPレスポンスヘッダー（ステータスコード、ヘッダーフィールド）を送信
  res.writeHead(200, {'Content-Type': 'text/plain'});

  // HTTPレスポンスのボディとして「Hellow World\n」を送信し、コネクションを切断
  res.end('Hello World\n');

// IP（127.0.0.1）とポート番号（1337）を設置してサーバーを起動
}).listen(1337, '127.0.0.1');

// コンソール（コマンドライン）にメッセージを表示
console.log('Server running at http://127.0.0.1:1337/');
