const path = require('path');
const fs = require('fs');

const manifest = require('./manifest.json');
manifest['subpacks'] = [];

// animations
const packDirs = []
const dir = fs.readdirSync(__dirname + '/template/animations/');
const paths = []

dir.forEach((d) => {
    if (d.endsWith('.json')) return paths.push(d);
    const dirFiles = fs.readdirSync(__dirname + '/template/animations/' + d);
    for (let file of dirFiles) {
        paths.push(d + '/' + file)
    }
    packDirs.push(d);
});

for (let index = 1; index <= 50; index++) {
    let content = []
    for (let file of paths) {
        const fileDir = path.join(__dirname, '/template/animations/', file);
        const data = fs.readFileSync(fileDir, 'utf8');

        content.push({
            name: ('channel_' + index + '/' + file),
            dir: (__dirname + '/subpacks/' + 'channel_' + index + '/animations/' + file),
            content: data.replace('$channel', index)
        }); 
    }

    genSubpack(index, content)
}

function genSubpack(index, content) {
    const sdir = path.join(__dirname, '/subpacks/', 'channel_' + index)
    const mainDir = path.join(__dirname, '/subpacks/', 'channel_' + index + '/animations/')

    if (!fs.existsSync(sdir)) fs.mkdirSync(sdir);
    if (!fs.existsSync(mainDir)) fs.mkdirSync(mainDir);

    packDirs.forEach((d) => {
        const packdir = path.join(mainDir, d);
        if (!fs.existsSync(packdir)) fs.mkdirSync(packdir);
    });

    for (let file of content) {
        fs.writeFileSync(file.dir, JSON.stringify(JSON.parse(file.content)), 'utf8')
        console.log(file.name)
    }

    manifest['subpacks'].push({
        "folder_name": `channel_${index}`,
        "name": `Texture Channel: ${index}`,
        "memory_tier": 0
    });

    console.log('');
}

manifest['subpacks'] = manifest['subpacks'].reverse()

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 4), 'utf8')