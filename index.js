const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const home = require("./routes/home");

ffmpeg.setFfmpegPath(ffmpegPath);

app.use(bodyParser.urlencoded({ extended: true }));

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

// Sử dụng middleware checkHeaders cho tất cả các route
app.use(checkHeaders);
// Endpoint URL/skm/m1.0/dk/plain
app.post('/receivesms', (req, res) => {
  // Lấy giá trị của query parameter key_id
  const query = req.body;
  console.log({query})
  res.send({"success": true,"message":"OK"});
  // // Kiểm tra xem key_id có tồn tại và có đúng giá trị hay không
  // if (keyId === '5f4f654fc78d0b675769aa8b13028448029e6cd5f8cd1116e70a16ab5df64757') {
  //   // Đúng key_id, trả về kết quả thành công
  //   res.send({"code":0,"message":"OK","value":{"dk":"c067e186801897df3e28ebb5d8ac4bb26cdde5014590566ec5dbf5364c5fbf39"}});
  // } else {
  //   // Sai key_id, trả về lỗi
  //   res.status(401).send('Unauthorized');
  // }
});
app.use("/home", home);
function streamvideo() {
  fs.readdir('./originvideo', (err, files) => {
    files.forEach((file) => {
      const folderName = `./videos/${file}`;
      try {
        if (!fs.existsSync(folderName)) {
          fs.promises.mkdir(folderName).then(() => {
            fs.mkdir(folderName, function () {
              ffmpeg(`./originvideo/${file}`)
              // set output format
                .format('hls')
                // set bitrate
                .videoBitrate(1024)
                // set target codec
                .videoCodec('libx264')
                // set audio bitrate
                .audioBitrate('128k')
                // set audio codec
                .audioCodec('aac')
                // set number of audio channels
                .audioChannels(2)
                // set hls segments time
                .addOption('-hls_time', 10)
                // include all the segments in the list
                .addOption('-hls_list_size', 0)
                // save to videos folder
                .save(`./videos/${file}/video.m3u8`)
                .on('start', function(commandLine) {
                  console.log('file : ' + file);
                  console.log('start : ' + commandLine);
                })
                .on('progress', function(progress) {
                    console.log(`Đang convert !! ${file}`, Date());
                })
                .on('end', function() {
                    console.log("convert thành công", file);

                })
                .on('error', function(err) {
                    console.log("reject");
                })
            })
          });
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
}
streamvideo();
app.use(express.static('public'));
app.use(express.static('videos'));
const port = process.env.POST || 4000;
app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});