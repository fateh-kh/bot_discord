const { readExcelAsObjects } = require('./sheet.js');

async function zonedsheet(guild) {
    const data = readExcelAsObjects('./rolessh.xlsx');
    console.log(`Found ${data.length} rows`);

    const simplified = data.map(row => ({
        fullName: row["Full Name"],
        discordUsername: row["Discord Username"],
    }));

    const sheetUsernames = new Set(
        simplified
            .map(r => r.discordUsername)
            .filter(Boolean)
            .map(u => u.toString().trim().toLowerCase())
    );

    const members = await guild.members.fetch();

    const roleIds = [
        process.env.DESIGN_ROLE_ID,
        process.env.DEVELOPMENT_ROLE_ID,
        process.env.MULTIMEDIA_ROLE_ID,
        process.env.COMMUNICATION_ROLE_ID,
        process.env.LOGISTICS_ROLE_ID,
    ];

    let success = 0;
    let failed = 0;
    const notInSheet = [];

    for (const member of members.values()) {
        if (member.user.bot) continue;

        const username = member.user.username?.trim().toLowerCase();
        const globalName = member.user.globalName?.trim().toLowerCase();
        const tagLegacy = member.user.tag?.trim().toLowerCase();

        const isInSheet =
            sheetUsernames.has(username) ||
            (globalName && sheetUsernames.has(globalName)) ||
            (tagLegacy && sheetUsernames.has(tagLegacy));

        if (isInSheet) continue;

        notInSheet.push({ id: member.id, username: member.user.username });

        try {
            for (const roleId of roleIds) {
                if (roleId && member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId);
                }
            }
            await member.roles.add(process.env.zoned);

            console.log(`Removed roles and added zoned role to ${member.user.username} (${member.id})`);
            success++;
        } catch (error) {
            console.error(`Error processing member ${member.user.username} (${member.id}):`, error);
            failed++;
        }
    }

    console.log(`\nSummary:`);
    console.log(`Total members processed: ${members.size}`);
    console.log(`Members not in sheet and updated: ${success}`);
    console.log(`Members not in sheet but failed to update: ${failed}`);

    return notInSheet;
}

module.exports = { zonedsheet };