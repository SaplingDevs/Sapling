$directory_bp = 'C:\Users\Alecs\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\Sapling BP'
$directory_rp = 'C:\Users\Alecs\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_resource_packs\Sapling RP'

$repository_destination = 'C:\Users\Alecs\Desktop\Programming\Addons\Sapling\sources'

if (Test-Path $repository_destination) {
    Remove-Item "$repository_destination\*" -Recurse -Force
}

if (Test-Path $directory_bp) {
    $new_name_bp = 'Sapling [BP]'
    $new_dir_bp = "$repository_destination\$new_name_bp"
    if (-not (Test-Path $new_dir_bp)) {
        New-Item -Path $new_dir_bp -ItemType Directory
    }
    Copy-Item -Path "$directory_bp\*" -Destination $new_dir_bp -Recurse
}

if (Test-Path $directory_rp) {
    $new_name_rp = 'Sapling [RP]'
    $new_dir_rp = "$repository_destination\$new_name_rp"
    if (-not (Test-Path $new_dir_rp)) {
        New-Item -Path $new_dir_rp -ItemType Directory
    }
    Copy-Item -Path "$directory_rp\*" -Destination $new_dir_rp -Recurse
}
