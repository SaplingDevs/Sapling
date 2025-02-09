# Welcome to Sapling's Quickstart!

#### Some things to keep in mind before installing Sapling:

::: info
- Sapling requires the `Beta APIs` experiment to be enabled.
- You need the `sapling_admin` tag to access all Sapling content.
- Make sure to download the latest version.
:::

---

# Installation Guides

## Installing Sapling
> To install Sapling on your device, download the files `Sapling` and `SaplingCUI` from the latest [release](https://github.com/SaplingDevs/Sapling/releases). After importing both files into your game, follow these steps:
> - **1.** Go to `Settings` > `Global resources` > `My packs` and enable `Sapling Addon [RP]`.
> - **2.** Go to your `world settings` > `Behavior packs` > `Available` and enable `Sapling Addon [BP]`.
> - **3.** In the `Experiments` section of your world settings, enable the `Beta APIs` experiment.

#### And that's it! Now you can use Sapling in your world.

## Updating Sapling
> When Sapling is updated, simply download the new files (`Sapling` and `SaplingCUI`) from the latest release and import them into your game.

## Installing Sapling in BDS (Bedrock Dedicated Server)
> To install Sapling on BDS, first download BDS [here](https://www.minecraft.net/en-us/download/server/bedrock) if you don't have it. Then, download the files from the latest release as you already know from the previous installation guide. Follow these steps:
> - **1.** Open the BDS folder and go to `development_behavior_packs`.
> - **2.** Move the `Sapling` (not `SaplingCUI`) file to this folder and rename it to `Sapling.zip` (change the extension from `.mcpack` to `.zip`).
> - **3.** Extract the `Sapling.zip` in the folder. We recommend using WinRAR for this. Click "Extract to `Sapling`."
> - **4.** After extraction, you should have a folder named `Sapling` containing the Sapling files.
> - **5.** You can't enable experimental modes directly in BDS, so you'll need to enable them in your game and export the world (see step **3** in the regular installation guide).
> - **6.** After exporting your world with experimental modes enabled, move the world to your BDS folder > `worlds`. The path should look like this: `BDS/worlds/myworld`.
> - **7.** Create a file named `world_behavior_packs.json` in your world folder if it doesn't exist and open it.
> - **8.** Open the file and add this content: `[{ "pack_id" : "803a4d54-12b2-42a1-ad1c-65d33a3c8296", "version" : [ 2, 1, 1 ] }]`
> - **9.** The value of the `"version"` property depends on the version of your Sapling. You can check the Sapling internal version in `development_behavior_packs/Sapling/manifest.json` under the `version` property.

#### And that's it! Now you can use Sapling on your server.

## Updating Sapling in BDS
> To update Sapling on BDS, it's simple: download the new files from the latest release. Follow these steps:
> - **1.** Delete the Sapling folder from `development_behavior_packs` and follow steps **1.** to **3.** from the Installation guide in BDS.
> - **2.** Update the `"version"` values in the `world_behavior_packs.json` file in your world folder. The internal version of Sapling can be found in `manifest.json` inside the Sapling files.

#### And that's it! Now you can use the latest version of Sapling on your server.

---

# Sapling Tips

## Texture Channels
::: tip
You've probably noticed a gear icon when enabling `SaplingCUI` in your global resources and wondered what it's for. Let me explain:

> A texture channel allows you to separate the visibility of certain visual elements (like Redstone indicators and chunk borders) from other players! This means that if you set a specific texture channel, you won't see visual features enabled by another player unless you're using the same channel. For example, if your friend is using texture channel `4` and you're using `10`, neither of you will see the other's visual elements.
:::

### How to Set It Up?
> Setting up a texture channel is simple. Just follow these steps:
> - Select a texture channel from the gear icon in `SaplingCUI` (e.g., `7`).
> - Enter your world with `Sapling` installed and use the following command:
>   - `#config textureChannel 7` (or the texture channel you selected).

#### And that's it! Your texture channel is now configured.