const fs = require('fs').promises;
const path = require('path');

exports.handler = async function (event, context) {
    const postsFile = path.join(__dirname, 'posts.json');
    const { id, type } = JSON.parse(event.body);

    const posts = JSON.parse(await fs.readFile(postsFile, 'utf8'));
    if (type === 'upvote') posts[id].upvotes++;
    else if (type === 'downvote') posts[id].downvotes++;
    await fs.writeFile(postsFile, JSON.stringify(posts, null, 2));

    return { statusCode: 200, body: JSON.stringify({ message: 'Vote recorded' }) };
};
