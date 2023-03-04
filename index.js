const express = require("express");
const app = express();
var cron = require("node-cron");
const axios = require("axios");
const token = "eOmgsTUTtZyOmKxkqFuw3Mc1glL8EkmT5fPGaSBrxiY";

cron.schedule("0 7 * * 1-5", () => {
  searchyoutube();
});

async function lineNotify(message) {
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const response = await axios.post(
      "https://notify-api.line.me/api/notify",
      `message=${message}`,
      options
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

function searchyoutube() {
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://youtube.googleapis.com/youtube/v3/search?q=ถ่ายทอดสด เรื่องเล่าเช้านี้&key=AIzaSyBh7WZnITqtUIqK2ApderC2s7uwkyP291c&channelId=UC5wKpLWxAZBZrunls3mzwEw",
    headers: {
      Accept: "application/json",
    },
  };

  axios(config)
    .then(function (response) {
      response.data.items.forEach((element) => {
        if (element.id.kind == "youtube#video") {
          console.log(element.id);
          lineNotify(`https://www.youtube.com/watch?v=${element.id.videoId}`);
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
