module.exports = async (ctx) => {
    const isTorrentExtension = (filename) => {
        const fileExtension = filename.split(".").pop();
        return fileExtension === "torrent";
    }
    const filename = ctx.message.document.file_name;
    ctx.torrent.messageId = ctx.message.message_id;
    ctx.torrent.torrentId = ctx.message.document.file_id;
    ctx.torrent.filename = ctx.message.document.file_name;
    if(!isTorrentExtension(filename)){
        return ctx.reply("It's not a torrent!");;
    }
    //show keyboard categories
    await ctx.menu.torrentMenuMiddleware.replyToContext(ctx);
    //fs logic
}