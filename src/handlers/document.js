module.exports = async (ctx) => {
    const isTorrentExtension = (filename) => {
        const fileExtension = filename.split(".").pop();
        return fileExtension === "torrent";
    }
    const filename = ctx.message.document.file_name;
    console.log(ctx.message.document);
    if(!isTorrentExtension(filename)){
        return ctx.reply("It's not a torrent!");;
    }
    //show keyboard categories
    await ctx.menu.torrentMenuMiddleware.replyToContext(ctx);
    //fs logic
}