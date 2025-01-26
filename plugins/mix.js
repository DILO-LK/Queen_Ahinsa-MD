const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');
const domain = `https://manu-ofc-api-site-6bfcbe0e18f6.herokuapp.com`;
const api_key = `Manul-Ofc-Song-Dl-Key-9`;

cmd({
    pattern: "song",
    alias: ["audio"],
    desc: 'Download Song / Video',
    use: '.play Title',
    react: "🎧",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('Please provide a title.');
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `*👉 𝐘𝐓 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 👈*
        
> *\`➤ Title\` :* ${data.title}

> *\`➤ Views\` :* ${data.views}

> *\`➤ DESCRIPTION\`:* ${data.description}

> *\`➤ TIME\`:* ${data.timestamp}

> *\`➤ AGO\`:* ${data.ago}

*◄❪ Reply This Message With Nambars ❫►*

1️⃣ Audio 🎧
2️⃣ Document 🗂️

> *⚖️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - : © 𝑫𝑰𝑳𝑰𝑺𝑯𝑨 𝑮𝑰𝑴𝑺𝑯𝑨𝑵*`;

        const vv = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':
    const response = await fetchJson(`${domain}/api/ytmp3?videoUrl=${data.url}&apikey=${api_key}`);
    
    const downloadUrl = response.data.dl_link;

//============Send Audio======================
await conn.sendMessage(from,{audio:{url: downloadUrl },mimetype:"audio/mpeg",caption :"> *⚖️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - : © 𝑫𝑰𝑳𝑰𝑺𝑯𝑨 𝑮𝑰𝑴𝑺𝑯𝑨𝑵*"},{quoted:mek})
                        break;
       
                    case '2':               
const responsex = await fetchJson(`${domain}/api/ytmp3?videoUrl=${data.url}&apikey=${api_key}`);
    
    const downloadUrlx = responsex.data.dl_link;

//=============Send Document=================
await conn.sendMessage(from,{document:{url: downloadUrlx },mimetype:"audio/mpeg",fileName: data.title + ".mp3" ,caption :"> *⚖️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - : © 𝑫𝑰𝑳𝑰𝑺𝑯𝑨 𝑮𝑰𝑴𝑺𝑯𝑨𝑵*"},{quoted:mek})
                        break;
 
                    default:
                        reply("Invalid option. Please select a valid option 💗");
                }

            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});
