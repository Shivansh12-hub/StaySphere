export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const upstreamResponse = await fetch('https://demohotelsapi.pythonanywhere.com/hotels/', {
            headers: {
                Accept: 'application/json',
            },
        });

        if (!upstreamResponse.ok) {
            return res.status(upstreamResponse.status).json({
                message: 'Failed to fetch hotel data from upstream API.',
            });
        }

        const payload = await upstreamResponse.json();

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json(payload);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error while fetching hotels.',
            detail: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
