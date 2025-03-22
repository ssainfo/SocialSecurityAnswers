const fs = require('fs').promises;
const path = require('path');

exports.handler = async function (event, context) {
    const postsFile = path.join(__dirname, 'posts.json');
    const data = JSON.parse(event.body);

    let posts = [];
    try {
        posts = JSON.parse(await fs.readFile(postsFile, 'utf8'));
    } catch (err) {
        // File doesn't exist yet, start with empty array
    }

    posts.push({ content: data.content, timestamp: data.timestamp, upvotes: 0, downvotes: 0, comments: [] });
    await fs.writeFile(postsFile, JSON.stringify(posts, null, 2));

    return { statusCode: 200, body: JSON.stringify({ message: 'Post submitted' }) };
};
