/**
 * Class to  store all the data of a user
 */

function USER(_name) {
    this.name = _name;
    this.messages = 0;  //Messages sent
    this.words = 0;     //Words sent
    this.letters = 0;   //Letters sent
    this.emojis = 0;    //Emojis sent
    this.emojiList = new WORDLIST();    //List that stores all the emojis sent
    this.wordList = new WORDLIST();     //List that stores all the words sent
    this.activityDay = new WORDLIST();  //List that stores all the days the user sent a message

    this.day = [0,0,0,0,0,0,0];  //Stores what day of the week the user sent a message

    this.hour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //Stores what hour of the day the user sent messages

    this.month = [0,0,0,0,0,0,0,0,0,0,0,0]; //Stores the months that user has sent messages

    this.y2017 = 0; //messages sent in 2017
    this.y2018 = 0; //messages sent in 2018

    //function used to add a new message of this user
    this.addMessage = function (message) {
        this.messages++;  //increase the amount of messages sent
        this.words += message.m.split(" ").length; //increase the ammount of words sent
        this.letters += message.m.replace(/\s/g, "").length; // increase the ammount of letters sent
        let word = message.m.split(/\s/); //seperate all the words of the message into an array
        //List of emojis that are checked for
        let emojiList = ["🤔", "😁", "😥", "👀", "💦", "❤", "😏", "😅", "👌", "😊", "☺️", "😳", "😥", "😊", "😋", "😂", "😉", "😭", "😮", "😀", "😁", "😃", "😘", "😔", "🙄", "😍", "😛", "😜", "😝", "😐", "😑", "😴", "🤢", "💯", "🍕", "😓", "😄", "😊", "🤠"];
        for(let w of word) {
            //check if the word is an emoji
            if (emojiList.indexOf(w) > -1) {
                this.emojis++; // increase the ammount of emojis sent
                this.emojiList.add(w)   //add the emoji to the emoji list
            } else {
                this.wordList.add(w)    //add the word to the word list
            }
        }
    };

    //function to add a new time for this user
    this.addTime = function (message) {
        date = new Date(message.t); // get the date from the timestamp of the message
        switch (date.getFullYear()) {
            case 2017: this.y2017++; break; //if the message was sent in 2017
            case 2018: this.y2018++; break; //if the message was sent in 2018
        }
        this.month[date.getMonth()]++;  // increase the value for the month of the message
        this.hour[date.getHours()]++;   // increase the value for the hour of the message
        this.day[date.getDay()]++;      // increase the value for the day of the message
        this.activityDay.add(date.toDateString()) //add the message to the activity counter
    };

    //function to display the emoji list
    this.getEmojiList = function (num, s) {
        let buffer = "";
        let array = this.emojiList.mostUsed(num);

        buffer += arrayToCsv(array,s);
        for (let word of array) {
            buffer += this.emojiList.getAmount(word) + s;
        }

        return buffer + "\n";
    };

    //function to display the word list
    this.getWordList = function (num, s) {
        let buffer = "";
        let array = this.wordList.mostUsed(num);

        buffer += arrayToCsv(array,s);
        for (let word of array) {
            buffer += this.wordList.getAmount(word) + s;
        }

        return buffer + "\n";
    };

    //function to display the most active days
    this.activeDays = function (num, s) {
        let buffer = "";
        let array = this.activityDay.mostUsed(num);

        buffer += arrayToCsv(array,s);
        for (let word of array) {
            buffer += this.activityDay.getAmount(word) + s;
        }

        return buffer + "\n";
    };

    //function to display the total activity
    this.totalActivity = function (s) {
        let buffer = "";
        let array = Object.keys(this.activityDay.list);

        buffer += arrayToCsv(array,s);
        for (let word of array) {
            buffer += this.activityDay.getAmount(word) + s;
        }

        return buffer + "\n";
    };

    //function to display the times of the day messages were sent
    this.allHours = function (s) {
        let buffer = "";

        buffer += "12am"+s+"1am"+s+"2am"+s+"3am"+s+"4am"+s+"5am"+s+"6am"+s+"7am"+s+"8am"+s+"9am"+s+"10am"+s+"11am"+s+"12pm"+s+"1pm"+s+"2pm"+s+"3pm"+s+"4pm"+s+"5pm"+s+"6pm"+s+"7pm"+s+"8pm"+s+"9pm"+s+"10pm"+s+"11pm" + "\n";
        buffer += arrayToCsv(this.hour, s);

        return buffer;
    };

    //function to display messages sent by weekday
    this.allDays = function (s) {
        let buffer = "";

        buffer += "Monday" + s + "Tuesday" + s + "Wednesday" + s + "Thursday" + s + "Friday" + s + "Saturday" + s + "Sunday" + "\n";
        buffer += arrayToCsv(this.day, s);

        return buffer
    };

    //function to display messages sent by month
    this.allMonths = function (s) {
        let buffer = "";

        buffer += "January" + s + "February" + s + "March" + s + "April" + s + "May" + s + "June" + s + "July" + s + "August" + s + "September" + s + "October" + s + "November" + s + "December" + s + "\n";
        buffer += arrayToCsv(this.month, s);

        return buffer;
    };

    //function to display messages sent by year
    this.allYears = function (s) {
        let buffer = "";

        buffer += "2017" + s + "2018" + "\n";
        buffer += this.y2017 + s + this.y2018 + "\n";

        return buffer;
    };

    //function to display the meta-data
    this.metaToCsvString = function (s) {
        let buffer = "";
        buffer = this.name + s + this.messages + s + this.words + s + this. letters + s + this.emojis + s + Math.floor((this.letters / this.messages) * 1000) / 1000;
        return buffer;
    };

    //helper function to create a cvs-string out of an array
    function arrayToCsv(arr, s) {
        return arr.join(s) + "\n"
    }
}
