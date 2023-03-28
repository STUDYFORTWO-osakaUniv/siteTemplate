'use strict';

function get_data(id) {
  const promise = new Promise((resolve, reject) => {
    fetch("https://sheets.googleapis.com/v4/spreadsheets/" + id + "/values/在庫リスト?key=AIzaSyCzHErhLM_SGjMqXYI8enMX22PndIX9Nl0")
      .then((res) => {
        return (res.json());
      })
      .then((json) => {
        //取得したデータに合わせてタイトルつけてみました
        var keys = ["isbn", "title", "author", "author_2nd", "publisher", "originalPrice", "sellingPrice", "genre", "before_stock", "sold", "reserved_reservations", "non_reserved_reservations", "stock"];

        var hashArray = [];
        //繰り返し処理にて実装
        for (var i = 1; i < json.values.length; i++) {
          var values = json.values[i];
          var hash = {}
          for (var v = 0; v < values.length; v++) {
            var key = keys[v];
            let value;
            if (key === "originalPrice" || key === "sellingPrice") {
              value = Number(values[v]);
            } else {
              value = values[v];
            }
            hash[key] = value;
          }
          hashArray.push(hash);
        }
        // console.log(hashArray);
        // return hashArray;
        resolve(hashArray)
      })
      .catch((error) => {
        // ここでエラー処理
        console.error(error);
        reject(error);
      })
  })

  return promise;

}
