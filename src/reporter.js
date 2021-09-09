const fetch = require("node-fetch");
//npm run report "Joker 1112"
const [nodePath, scriptPath, filename] = process.argv;
async function reportTorrentDownload(filename){
    const url = "http://localhost:3000/report/";
    const body = { filename };
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return response.json();
}

reportTorrentDownload(filename);