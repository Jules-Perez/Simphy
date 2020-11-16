const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const simsimi = require("simsimi")({
  key: "V7TTguDPxsPx0isd5CNM3ghHKqn5COVIxgz76LvR",
});
client.friendsList = require("./friendsList.json");

//250508511019139073 <- Mine
//291219008542343169 <- Kuro
const simpingUserID = "291219008542343169";

var isConversating = false;
var isBehaving = false;

var kuroGreetings = ["HI", "HELLO", "SUP", "YOW", "HEYO", "YO"];
var simphyGreetingsRespo = [
  "Hi master kuroro :heart_eyes:",
  "what do you need master? :smiling_face_with_3_hearts:",
  "HELLO KURORO! :heart_eyes:",
];
var simphySusGreetingsRespo = [
  "What do you want?",
  "Go away",
  "Don't talk to me",
  "Who are you again?",
  "Don't you anything better to do?",
];

var isKuroSentLoveMsg = false;
var kuroLoveMsg = ["HEART", "LOVE", "LIKE", "CARE"];
var simphyLoveMsgRespo = [
  "LOVE ME MASTER! :smiling_face_with_3_hearts:",
  "I LOVE YOU TOO KURORO :smiling_face_with_3_hearts:",
  "LOVE ME ONLY! :smiling_face_with_3_hearts:",
];
var simphySusLoveRespo = [
  "No Never! :rage:",
  "Scram :rage:",
  "Go love yourself! :rage:",
  "Hate you.",
];

function simphyResponse(msgType) {
  switch (msgType) {
    case "greetings":
      return simphyGreetingsRespo[
        Math.floor(Math.random() * simphyGreetingsRespo.length)
      ];
    case "loveMsg":
      return simphyLoveMsgRespo[
        Math.floor(Math.random() * simphyLoveMsgRespo.length)
      ];
    case "susGreetings":
      return simphySusGreetingsRespo[
        Math.floor(Math.random() * simphySusGreetingsRespo.length)
      ];
    case "susLoveMe":
      return simphySusLoveRespo[
        Math.floor(Math.random() * simphySusLoveRespo.length)
      ];
    default:
      break;
  }
}

function doCommand(command, content, msg) {
  switch (command) {
    case "BEHAVE":
      isBehaving = true;
      isConversating = false;
      msg.reply("Okay master... :frowning:");
      msg.reply(
        "Please say 'simphy bark' if you would like me to bark again..."
      );
      return true;
    case "SUS":
      userId = msg.mentions.users.first().id;
      if (userId == client.id) {
        msg.channel.send("You should not hate me master... :cry: ");
      } else if (userId || userId != "") {
        client.friendsList[userId] = {
          unfriended: true,
        };
        fs.writeFile(
          "./friendsList.json",
          JSON.stringify(client.friendsList, null, 4),
          (err) => {
            if (err) throw err;
            msg.channel.send(
              "Ok, sus on " + msg.mentions.users.first().username + "! :rage:"
            );
          }
        );
      } else {
        msg.reply("I can't recognize who " + content + " is. :confused:");
      }
      return true;
    case "BEFRIEND":
      userId = msg.mentions.users.first().id;
      if (userId == client.id) {
        msg.channel.send("I am already your loyal companion master! :smile:");
      } else if (userId || userId != "") {
        client.friendsList[userId] = {
          unfriended: false,
        };
        fs.writeFile(
          "./friendsList.json",
          JSON.stringify(client.friendsList, null, 4),
          (err) => {
            if (err) throw err;
            msg.channel.send("As you wish! " + content + " no longer sus.");
          }
        );
      } else {
        msg.reply("I can't recognize who " + content + " is. :confused:");
      }
      return true;
    case "CONVERSE":
      isConversating = true;
      msg.reply(
        "Ok master. will talk with anyone in the server where i belong :smile:"
      );
      return true;
    default:
      return false;
  }
}

client.on("ready", () => {
  console.log("Kuro's Dog is Online");
});

client.on("message", (msg) => {
  
  console.log("["+msg.createdAt+ "] "+ msg.author.username + ": " + msg.content );
  msg.content = msg.content.replace(".", "");

  if (msg.author.id == "759335573822636032") {
    //this is bot
    return;
  }

  if (
    //This turns the bot off
    isBehaving &&
    msg.content.toUpperCase() == "SIMPHY BARK" &&
    msg.author.id == simpingUserID
  ) {
    isBehaving = false;
    msg.reply("Arf Arf! :smiling_face_with_3_hearts: ");
  } else if (isBehaving) {
    return;
  }

  if (msg.author.id == simpingUserID) {
    if (!isConversating) {
      if (isKuroSentLoveMsg && msg.content.toUpperCase().includes("NOT YOU")) {
        //Special response
        msg.reply("LOVE ME ONLY! :rage:");
        isKuroSentLoveMsg = false;
        return;
      } else isKuroSentLoveMsg = false;

      if (msg.content.toUpperCase().includes("SIMPHY LOVE ME")) {
        msg.reply("YES MASTER ILL LOVE YOU! <3");
        return;
      }

      //Kuro's messages
      kuroGreetings.forEach((greetings) => {
        if (msg.content.toUpperCase().includes(greetings)) {
          msg.reply(simphyResponse("greetings"));
          return;
        }
      });

      kuroLoveMsg.forEach((loveMsg) => {
        if (msg.content.toUpperCase().includes(loveMsg)) {
          isKuroSentLoveMsg = true;
          msg.reply(simphyResponse("loveMsg"));
          return;
        }
      });
    }

    if (msg.content.toUpperCase().startsWith("SIMPHY")) {
      let editedMsg = msg.content.slice(7);
      let command = editedMsg.split(" ")[0].toUpperCase();
      let content = "";
      try {
        content = editedMsg.split(" ")[1];
      } catch {}
      if (doCommand(command, content, msg)) return;
    }
  }

  //Simsimi
  if (isConversating) {
    (async () => {
      try {
        const response = await simsimi(msg.content);
        msg.reply(response);
      } catch (err) {
        msg.reply("Im sorry what?");
        console.log("simsimi err", err);
      }
    })();
  }
  //end of simsimi

  let userIsSus =
    client.friendsList[msg.author.id] &&
    client.friendsList[msg.author.id].unfriended;

  if (userIsSus && msg.mentions.users.get(simpingUserID)) {
    msg.reply("Master doesnt need you! Grrrr :rage::rage::rage:");
  }

  if (msg.content.toUpperCase().includes("HI SIMPHY")) {
    if (userIsSus) {
      msg.reply(simphyResponse("susGreetings"));
    } else {
      msg.reply("Hello " + msg.author.username + ".");
    }
  }

  if (msg.content.toUpperCase().includes("SIMPHY LOVE ME")) {
    if (userIsSus) {
      msg.reply(simphyResponse("susLoveMe"));
    } else {
      msg.reply("no. you're not my master.");
    }
  }
});

client.login(process.env.Simphy_Token);
