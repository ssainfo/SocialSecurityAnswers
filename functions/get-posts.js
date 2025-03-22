const fs = require('fs').promises;
const path = require('path');

exports.handler = async function (event, context) {
    const postsFile = path.join(__dirname, 'posts.json');
    try {
        const posts = JSON.parse(await fs.readFile(postsFile, 'utf8'));
        return { statusCode: 200, body: JSON.stringify(posts) };
    } catch (err) {
        return { statusCode: 200, body: JSON.stringify([]) }; // Return empty array if no posts
    }
};
