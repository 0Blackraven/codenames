async function getRandomWords() {
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    try {
        const response = await fetch("/words.txt");
        
        if (!response.ok) {
            throw new Error(`Failed to fetch words. Status: ${response.status}`);
        }

        const text = await response.text();
        const words = text.split(/\r?\n/); // Handle different OS line endings

        const values = Array(9).fill(1).concat(Array(8).fill(2)).concat(Array(7).fill(0)).concat([3]);
        shuffleArray(values);

        const resultObject = {}; // Change from array to object

        for (let i = 0; i < 25; i++) {
            let randomIndex;
            let word;
            do {
                randomIndex = Math.floor(Math.random() * words.length);
                word = words[randomIndex];
            } while (resultObject.hasOwnProperty(word)); // Avoid duplicates
            
            resultObject[word] = { value: values[i] }; // Store only the value
        }

        return resultObject; // Return an object instead of an array
    } catch (err) {
        console.error("Error fetching words:", err);
        return {}; // Return empty object on failure
    }
}

export default getRandomWords;
