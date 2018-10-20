window.onload = function() {
    //Event to trigger when the user uploads a file
    document.getElementById("FileInput").addEventListener('change', readFile, false)
};

//import JSZip from 'jszip';
//const zlib = require('zlib');

let FILE;

//Meta Data
let users;
let channels;
let messages;
let userName = [];

//Stores all the user in the log
let userStore = [];

//Stores the data for all users
let total = new USER("Total");

//function that is called when a new file is uploaded
function readFile(e) {
    console.log("trying to read file...");
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();

    reader.onload = function (e) {
        let data;

        try{
            data = JSON.parse(e.target.result)
        } catch (e) {
            console.error(e);
            return;
        }

        if (SAVEFILE.isValid(data)){
            analyzeFile(new SAVEFILE(data))
        }
    };
    reader.readAsText(file);
}

//Analyzing the parsed File
function analyzeFile(file) {
    console.log("trying to analyze file...");
    FILE = file;
    setup();
}

//Setting up the base data
function setup() {
    console.log("trying to set meta-data...");

    //setting up the users
    users = FILE.getUsers();
    Object.keys(users).forEach(function (user) {
        userName[FILE.getUserIndex(user)] = users[user].name;
    });
    //generating the USER Objects to store all the chat data in
    for(let i in userName) {
        userStore[i] = new USER(userName[i]);
    }
    //setting up the messages
    channels = FILE.getChannels();
    messages = FILE.getMessages(Object.keys(channels));
    analyzeMessages()
}

//function that goes over all the messages
function analyzeMessages() {
    let start =  new Date().getTime();
    for (let m in messages) {
        analyzeMessage(messages[m])
    }
    alert("done after " + new Date().getTime() - start + "ms!");
}

//function that analyzes a single message
function analyzeMessage(message) {
    //add the message data to the total store
    total.addMessage(message);
    total.addTime(message);

    //add the message data to the store of the user that sent the message
    userStore[message.u].addMessage(message);
    userStore[message.u].addTime(message);
}

//function that gathers all the data to write in the file for the download
function getData(s) {
    const numEmojis = 10;   //Top # Nmber of Emojis to be written in the file
    const numWords = 10;    //Top # Nmber of Words to be written in the file
    const numDays = 3;      //Top # Nmber of Days to be written in the file
    const ALLDAYS = true;   //Setting to display the activity for every day

    let data = "";

    //Setting the header for the meta-data
    data += "User" + s + "Messages" + s + "Words" + s + "Letters" + s + "Emojis" + s + "Average Message Length" + "\n";
    //Write the meta-data for each user
    for (let u of userStore) {
        data += u.metaToCsvString(s) + "\n"
    }
    //write the meta-data for all messages
    data += total.metaToCsvString(s) + "\n\n";

    //Write the most used stuff for every user
    for (let u of userStore) {
        data += u.name + " most used Emojis:\n" +
            u.getEmojiList(numEmojis, s) + "\n" +
            u.name + " most used Words:\n" +
            u.getWordList(numWords, s) + "\n" +
            u.name + " most active Days:\n" +
            u.activeDays(numDays, s) + "\n" +
            "\n"
    }
    //write the most used stuff for all messages
    data += total.name + " most used Emojis:\n" +
        total.getEmojiList(numEmojis, s) + "\n" +
        total.name + " most used Words:\n" +
        total.getWordList(numWords, s) + "\n" +
        total.name + " most active Days:\n" +
        total.activeDays(numDays, s) + "\n" +
        "\n";

    //write the messages by Hour/week/month/year for all users
    for (let u of userStore) {
        data += u.name + " Messages by Hour:\n" +
            u.allHours(s) + "\n" +
            u.name + " Messages by Weekday:\n" +
            u.allDays(s) + "\n" +
            u.name + " Messages by Month:\n" +
            u.allMonths(s) + "\n" +
            u.name + " Messages by Year:\n" +
            u.allYears(s) + "\n" +
            "\n"
    }
    //write the messages by hour/week/month/year for total
    data += total.name + " Messages by Hour:\n" +
        total.allHours(s) + "\n" +
        total.name + " Messages by Weekday:\n" +
        total.allDays(s) + "\n" +
        total.name + " Messages by Month:\n" +
        total.allMonths(s) + "\n" +
        total.name + " Messages by Year:\n" +
        total.allYears(s) + "\n" +
        "\n";

    //total activity for every day
    if (ALLDAYS) {
        for (let u of userStore) {
            data += u.name + " activity by day:\n" +
                u.totalActivity(s) + "\n"
        }
        data += total.name + " activity by day:\n" +
            total.totalActivity(s) + "\n";
    }

   /* let zip = new JSZip();

    zip.file(data);

    zip.generateAsync({type: "blob"}).then(function (content) {
       return content
    });*/

    return data;
}

//function to generate a filename
function getFilename() {
    return userName.join() + "#" + new Date().getTime() + ".csv";
}

//function to download a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.data = "text/csv;charset=utf-8";
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function multiDownload() {
    download(getData(","), getFilename(), "text/csv");
    download(getData(","), getFilename(), "text/csv");
}