const express = require('express');
const app = express();
const port = 4000;
// Middleware để kiểm tra headers
// const checkHeaders = (req, res, next) => {
//   const appKey = req.headers['application-key'];
//   const appSecret = req.headers['application-secret'];
//   // Kiểm tra xem headers có đúng giá trị hay không
//   if (
//     appKey === 'sgh_smilehope_live_e3550a79f66610b4c346' &&
//     appSecret === '44f1dfd81fd145e8ade4fcec0c5c29d540fc429e1761df7f01cc4cd5649828c6c5a0d370d7d92872f1c846e4c863979f'
//   ) {
//     // Headers đúng, tiếp tục xử lý các middleware và route tiếp theo
//     next();
//   } else {
//     // Headers sai, trả về lỗi
//     res.status(401).send('Unauthorized');
//   }
// };

// // Sử dụng middleware checkHeaders cho tất cả các route
// app.use(checkHeaders);
// // Endpoint URL/skm/m1.0/dk/plain
// app.get('/skm/m1.0/dk/plain', (req, res) => {
//   // Lấy giá trị của query parameter key_id
//   const keyId = req.query.key_id;

//   // Kiểm tra xem key_id có tồn tại và có đúng giá trị hay không
//   if (keyId === '5f4f654fc78d0b675769aa8b13028448029e6cd5f8cd1116e70a16ab5df64757') {
//     // Đúng key_id, trả về kết quả thành công
//     res.send({"code":0,"message":"OK","value":{"dk":"c067e186801897df3e28ebb5d8ac4bb26cdde5014590566ec5dbf5364c5fbf39"}});
//   } else {
//     // Sai key_id, trả về lỗi
//     res.status(401).send('Unauthorized');
//   }
// });

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});