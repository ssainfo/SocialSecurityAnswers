const fetch = require('node-fetch');

exports.handler = async (event) => {
    const question = event.queryStringParameters.q;
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.CX_ID;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=site:ssa.gov ${encodeURIComponent(question)}`;
    const res = await fetch(url);
    const data = await res.json();
    const link = data.items?.[0]?.link || `https://www.ssa.gov/site/search/?q=${question}`;
    return {
        statusCode: 200,
        body: JSON.stringify({ answer: link })
    };
};
