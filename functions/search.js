const fetch = require('node-fetch');

exports.handler = async (event) => {
    const question = event.queryStringParameters.q;
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyBfE9lpZ3ml5jiDN4Q9_MDZ_HIIlChN4og';
    const cx = process.env.CX_ID || '873805d868a404f81';
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=site:ssa.gov ${encodeURIComponent(question)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const link = data.items?.[0]?.link || `https://www.ssa.gov/site/search/?q=${encodeURIComponent(question)}`;
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: link })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: `https://www.ssa.gov/site/search/?q=${encodeURIComponent(question)}`, error: 'Search failed' })
        };
    }
};
