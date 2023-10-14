/** @type {import('next').NextConfig} */
const nextConfig = (module.exports = {
    headers: () => [
        {
            source: "/:orders*",
            headers: [
                {
                    key: "Cache-Control",
                    value: "no-store",
                },
            ],
        },
    ],
});

module.exports = nextConfig;
