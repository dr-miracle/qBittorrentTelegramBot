module.exports = async (ctx) => {
    const isTorrentExtension = (filename) => {
        const fileExtension = filename.split(".").pop();
        return fileExtension === "torrent";
    }
    const filename = ctx.message.document.file_name;
    if(!isTorrentExtension(filename)){
        return;
    }
    //show keyboard categories
    //fs logic

    // if (isTorrentExtension(filename)){
    //     ctx.reply("Add torrent!");
    // }else{
    //     ctx.reply("It's not a torrent!");
    // }
}