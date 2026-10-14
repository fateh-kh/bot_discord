const { readExcelAsObjects } = require('./sheet.js');

async function rolesheetexchange(guild) {
   const data = readExcelAsObjects('./rolesnew.xlsx');
    console.log(`Found ${data.length} rows`);
if (data.length > 0) {
    console.log('--- RAW HEADERS ---');
    console.log(Object.keys(data[0]));
}

const simplified = data.map(row => ({
    fullName: row["Full Name"],
    discordUsername: row["Discord Username"],
    exrole: row["Last season's department "],
    newrole: row["new depa"]
}));



    console.log(`Starting role update for ${simplified.length} members in guild: ${guild.name}`);

    await guild.members.fetch();

    let updated = 0;
    let failed = 0;

    for (const row of simplified) {
        const usernameToFind = row.discordUsername;

        if (!usernameToFind) {
            console.log(`⚠️ Skipping row for "${row.fullName}" — no Discord username provided`);
            failed++;
            continue;
        }

        const member = guild.members.cache.find(
            m => m.user.username.toLowerCase() === usernameToFind.toLowerCase()
        );

        if (!member) {
            console.log(`⚠️ No matching Discord member found for "${usernameToFind}" (${row.fullName})`);
            failed++;
            continue;
        }

        let newroleid;
        switch (row.newrole) {
            case 'Design': newroleid = process.env.DESIGN_ROLE_ID; break;
            case 'Development': newroleid = process.env.DEVELOPMENT_ROLE_ID; break;
            case 'Multimedia': newroleid = process.env.MULTIMEDIA_ROLE_ID; break;
            case 'Communication': newroleid = process.env.COMMUNICATION_ROLE_ID; break;
            case 'Logistics': newroleid = process.env.LOGISTICS_ROLE_ID; break;
            default:
                console.log(`⚠️ Unknown newrole "${row.newrole}" for ${usernameToFind}`);
                failed++;
                continue;
        }

        let exroleid;
        switch (row.exrole) {
            case 'Design': exroleid = process.env.DESIGN_ROLE_ID; break;
            case 'Development': exroleid = process.env.DEVELOPMENT_ROLE_ID; break;
            case 'Multimedia': exroleid = process.env.MULTIMEDIA_ROLE_ID; break;
            case 'Communication': exroleid = process.env.COMMUNICATION_ROLE_ID; break;
            case 'Logistics': exroleid = process.env.LOGISTICS_ROLE_ID; break;
            default:
                console.log(`⚠️ Unknown exrole "${row.exrole}" for ${usernameToFind}`);
                exroleid = null; // don't fail the whole row just for a missing old role
        }

        try {
            if (exroleid && member.roles.cache.has(exroleid)) {
                await member.roles.remove(exroleid);
                console.log(`Removed role ${exroleid} from ${member.user.username}`);
            }
            if (newroleid ) {
                await member.roles.add(newroleid);
                console.log(`Added role ${newroleid} to ${member.user.username}`);
            }
            updated++;
        } catch (err) {
            console.error(`❌ Failed to update roles for ${member.user.username}:`, err.message);
            failed++;
        }
    }

    console.log(`✅ Done. Updated: ${updated}, Failed: ${failed}`);
}

module.exports = { rolesheetexchange };
//--------------------------------------------------------------------------------------------------------------------------

