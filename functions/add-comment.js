const fs = require('fs').promises;
const path = require('path');

exports.handler = async function (event, context) {
    const postsFile = path.join(__dirname, 'posts.json');
    const { postId, comment } = JSON.parse(event.body);

    const posts = JSON.parse(await fs.readFile(postsFile, 'utf8'));
    if (!posts[postId].comments) posts[postId].comments = [];
    posts[postId].comments.push(comment);
    await fs.writeFile(postsFile, JSON.stringify(posts, null, 2));

    return { statusCode: 200, body: JSON.stringify({ message: 'Comment added' }) };
};
