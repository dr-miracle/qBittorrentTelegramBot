const replyAndDelayedDelete = async (ctx, text, delay = 500) => {
    const sucessMessage = await ctx.reply(text);
    return setTimeout(async () => {
        await ctx.telegram.deleteMessage(sucessMessage.chat.id, sucessMessage.message_id);
    }, delay);
}

module.exports = {
    replyAndDelayedDelete
};