const express = require('express');
var path = require('path');
var _ = require('lodash');
const fs = require('fs');
const bodyParser = require('body-parser');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const home = require("./routes/home");
const socketIO = require('socket.io');
const http = require('http');
// const cors = require('cors');
const nodemailer = require("nodemailer");


ffmpeg.setFfmpegPath(ffmpegPath);
const app = express();
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: 'https://zinson.vn',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});

// Middleware để kiểm tra headers
const checkHeaders = (req, res, next) => {
  next();
  // const appKey = req.headers['application-key'];
  // const appSecret = req.headers['application-secret'];
  // // Kiểm tra xem headers có đúng giá trị hay không
  // if (
  //   appKey === 'sgh_smilehope_live_e3550a79f66610b4c346' &&
  //   appSecret === '44f1dfd81fd145e8ade4fcec0c5c29d540fc429e1761df7f01cc4cd5649828c6c5a0d370d7d92872f1c846e4c863979f'
  // ) {
  //   // Headers đúng, tiếp tục xử lý các middleware và route tiếp theo
  //   next();
  // } else {
  //   // Headers sai, trả về lỗi
  //   res.status(401).send('Unauthorized');
  // }
};

function sendMail(email) {
  if (!email) {
    return;
  }
  let transporter = nodemailer.createTransport({
    service: "gmail", // e.g., "Gmail", "Outlook", etc.
    auth: {
      user: "thaithailuongvien@gmail.com",
      pass: "csgpmiawnquhaqbi",
    },
  });

  // Email data
let mailOptions = {
  from: "thaithailuongvien@gmail.com",
  to: `${email}`,
  subject: "Khóa học đã kích hoạt thành công",
  html: `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template with Centered Button</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; text-align: center;">
      <table cellpadding="0" cellspacing="0" width="100%" height="100%">
          <tr>
              <td align="center" valign="top">
                  <table cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                      <tr>
                          <td align="center" bgcolor="#f1f1f1" style="padding: 20px;">
                              <h1>Khóa học đã được kích hoạt</h1>
                              <p>Khóa học làm web2h của bạn đã kích hoạt thành công, vui lòng nhấn vào bên dưới</p>
                              <a href="https://www.example.com" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Đến khóa học</a>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`
};

// Sending the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error occurred: ", error);
  } else {
    console.log("Email sent successfully: ", info.response);
  }
});
}

// Sử dụng middleware checkHeaders cho tất cả các route
app.use(checkHeaders);
// Endpoint URL/skm/m1.0/dk/plain
app.post('/receivesms', (req, res) => {
  // Lấy giá trị của query parameter key_id
  const body = req.body;
  let textSmsArr = _.get(body, 'data', '').split('\n');

  console.log(textSmsArr[0])
  console.log(textSmsArr[1])

  // Regular expression to match the pattern for "+X,XXXVND"
const amountRegex = /\+([\d,]+)/;
const amountMatch = textSmsArr[1].match(amountRegex);

// Regular expression to match the pattern for "PHAM VAN DUY chuyen tien"
const ndRegex = /ND:\s*(.*?)\s*web2h/;
const nameMatch = textSmsArr[1].match(ndRegex);

// Extracting the matched values
amount = amountMatch ? amountMatch[0] : null;

const name = nameMatch ? nameMatch[1] : null;
amount = parseInt(_.replace(_.replace(amount, ',', ''), '+', ''));
let gmail = `${name}@gmail.com`;
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
if (amount <= 399000 && gmailRegex.test(gmail)) {
  sendMail(gmail);
}

  res.send({"success": true,"message":"OK"});
  io.emit(`${name}_sendsms`, {success: true});
});


// Set up the WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
app.use("/home", home);
// function streamvideo() {
//   fs.readdir('./originvideo', (err, files) => {
//     files.forEach((file) => {
//       const folderName = `./videos/${file}`;
//       try {
//         if (!fs.existsSync(folderName)) {
//           fs.promises.mkdir(folderName).then(() => {
//             fs.mkdir(folderName, function () {
//               ffmpeg(`./originvideo/${file}`)
//               // set output format
//                 .format('hls')
//                 // set bitrate
//                 .videoBitrate(1024)
//                 // set target codec
//                 .videoCodec('libx264')
//                 // set audio bitrate
//                 .audioBitrate('128k')
//                 // set audio codec
//                 .audioCodec('aac')
//                 // set number of audio channels
//                 .audioChannels(2)
//                 // set hls segments time
//                 .addOption('-hls_time', 10)
//                 // include all the segments in the list
//                 .addOption('-hls_list_size', 0)
//                 // save to videos folder
//                 .save(`./videos/${file}/video.m3u8`)
//                 .on('start', function(commandLine) {
//                   console.log('file : ' + file);
//                   console.log('start : ' + commandLine);
//                 })
//                 .on('progress', function(progress) {
//                     console.log(`Đang convert !! ${file}`, Date());
//                 })
//                 .on('end', function() {
//                     console.log("convert thành công", file);

//                 })
//                 .on('error', function(err) {
//                     console.log("reject");
//                 })
//             })
//           });
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     });
//   });
// }
// streamvideo();
app.use(express.static('public'));
app.use(express.static('videos'));
app.get('/', (req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});
const port = process.env.POST || 4000;
server.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});