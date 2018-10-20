/**
 * Class to store a list of something
 */

function WORDLIST() {
    this.list = {}; //the map object that stores the data
    
    //function to add something to the list
    this.add = function (word) {
        //check if there allready if an entry for this
        if (this.list.hasOwnProperty(word)) {
            this.list[word]++; //if so just increase the counter
        } else {
            this.list[word] = 1; //otherwise create it and set it to 1
        }
    };

    //function to get the ammount of a single object
    this.getAmount = function (id) {
        return this.list[id];
    };

    //function that calculates the most used words
    this.mostUsed = function (num) {
        let mapKeys = Object.keys(this.list);
        let mostUsed = [];

        for (let key of mapKeys) {
            //List of words to exclude
            let forbiddenWords = ["", "i", "I", "I'm", "to", "the", "you", "it", "a", "and", "like", "that", "is", "me", "my", "so", "of", "for", "just", "not", "have", "but", "in", "be", "im", "do", "dont", "this", "its", "was", "if", "he", "on", "are", "at", "am", "or", "how", "what", "with", "no", "yeah", "will", "they", "one", "up", "thats", "then", "get", "can", "and", "about", "when", "even", "go", "also"];
            if (forbiddenWords.indexOf(key) > -1)
            {
                continue;
            }

            mostUsed.push(key);

            let x = mostUsed.length -2;
            while (x > -1) {
                if (this.list[mostUsed[x]] <= this.list[mostUsed[x + 1]]) {
                    let store = mostUsed[x];
                    mostUsed[x] = mostUsed[x+1];
                    mostUsed[x+1] = store;
                }
                x--;
            }

            if (mostUsed.length === (num + 1)) mostUsed.pop();
        }

        return mostUsed;
    }
}