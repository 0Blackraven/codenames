import { readFile } from 'fs';

function getRandomWords() {
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    readFile('words.txt', 'utf8', (err, data) => {
        if (err) throw err;

        // Split the text into words
        const words = data.split('\r\n');

        // Create an array of values to be assigned
        const values = Array(9).fill(1).concat(Array(8).fill(2)).concat(Array(7).fill(0)).concat(3);

        // Shuffle the values array
        shuffleArray(values);

        // Create a map to store the unique random words with their assigned values
        const result = {};

        // Pick 25 unique words and assign the shuffled values to them
        for (let i = 0; i < 25; i++) {
            let randomIndex;
            let word;

            // Ensure that we pick unique words each time
            do {
                randomIndex = Math.floor(Math.random() * words.length);
                word = words[randomIndex];
            } while (result.hasOwnProperty(word));

            // Assign the shuffled value to the word
            result[word] = values[i];
        }
        console.log(result);
        // return result;
    });
}

getRandomWords();
