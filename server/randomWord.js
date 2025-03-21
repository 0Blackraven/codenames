import { promises as fs } from "fs";

async function getRandomWords() {
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    try {
        const text = await fs.readFile("./words.txt", "utf-8");
        const words = text.split(/\r?\n/); // Handle different OS line endings

        // Define values: 9 red, 8 blue, 7 neutral, 1 black
        const values = Array(9).fill(1).concat(Array(8).fill(2)).concat(Array(7).fill(0)).concat([3]);
        shuffleArray(values);

        const resultArray = [];
        const usedWords = new Set();

        while (resultArray.length < 25) {
            let randomIndex = Math.floor(Math.random() * words.length);
            let word = words[randomIndex];

            if (!usedWords.has(word)) {
                usedWords.add(word);
                resultArray.push({
                    name: word,
                    value: values[resultArray.length],
                    isClicked: false
                });
            }
        }

        console.log(resultArray);
        return resultArray;
    } catch (err) {
        console.error("Error reading words file:", err);
        return [];
    }
}

export default getRandomWords;

