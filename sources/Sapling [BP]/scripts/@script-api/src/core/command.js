import { world, system } from '@minecraft/server';
import Parser from './src/regex';
import { JsonDB } from '@script-api/sapling.js';

let commands = {};
class Command {
  #data;
  static prefix = './';
  
  constructor(data = {}) {
    this.#data = data;
    this.#data.subcommands = {}; 
  }
  
  // Build Command
  build(extension = false) {
    let [ cmd, rmd ] = [ Command.prefix + this.#data.name, '#' + this.#data.name];
    
    if (!this.#data.args) this.#data.args = [];
    if (!this.#data.description) this.#data.description = '';
    if (!extension && !this.#data.validation) this.#data.validation = () => true;
    else if (extension) {
      this.#data.validation = (sender) => {
        const isAdmin = sender.hasTag("sapling_admin");
        const validation = this.#data.extensionValidation;
        const gamerules = { 
          ...Object.fromEntries(sender.getTags().map((t) => t.startsWith("client:") ? [ t.replace("client:", ""), true ] : null).filter((t) => t)),
          ...(new JsonDB("ServerGamerules").parse()),
          ...(new JsonDB("EngineGamerules").parse())
      }

        if (validation?.checkAdmin && !isAdmin) return false;
        if (validation?.requiredGamerules.length > 0) {
            let checked = 0;
            validation.requiredGamerules.forEach((g) => checked += gamerules[g] ? 1 : 0);
            if (validation.requiredGamerules.length !== checked) return false;
        }

        return true;
      }
    }


    this.#data.reference = false;

    commands[cmd] = this.#data;
    commands[rmd] = this.#data;
    return commands[cmd];
  }

  rawCommand(callback) {
    let [ cmd, rmd ] = [ Command.prefix + this.#data.name, '#' + this.#data.name];
    
    this.#data.callback = callback;
    this.#data.reference = true;
    if (!this.#data.validation) this.#data.validation = () => true;

    commands[cmd] = this.#data;
    commands[rmd] = this.#data;
    return commands[cmd];
  }
  
  // Get All Commands
  static getCommands() {
    return commands;
  }
  
  // Setters for main command options
  setName(name) {
    this.#data.name = name;
    return this;
  }
  
  setDescription(description) {
    this.#data.description = description;
    return this;
  }

  // Set callback for the main command
  setCallback(callback) {
    this.#data.callback = callback;
    return this;
  }

  // Add arguments to the main command
  addArgument(type, name) {
    if (!this.#data.args) this.#data.args = [];
    this.#data.args.push({ type, name });
    return this;
  }

  // Add subcommand
  addSubcommand(name, commandBuilder) {
    const subcommand = new Command();
    subcommand.setName(name);
    commandBuilder(subcommand);
    this.#data.subcommands[name] = subcommand.build();
    return this;
  }

  setValidation(callback) {
    this.#data.validation = callback;
    return this;
  }
}

function checkArg(value, type) {
  let data;
  if (type == 'array' && Array.isArray(value)) data = value;
  else if (type == 'identifier' && /@[aepsr]\[/g.test(value)) data = value;
  else if (type == 'identifier' && /@[aepsr]/g.test(value) && value.length == 2) data = value;
  else if (type == 'player' && value.startsWith('@"') && value.endsWith('"')) data = value;
  else if (type == 'player' && value.startsWith('@') && !value.includes(' ')) data = value;
  else if (type.includes('|')) {
    let ts = type.split('|');
    let tv = typeof value;
    
    if (ts.includes(tv)) data = value;
    else data = null;
  } else if (typeof value == type) data = value;
  else data = null;
  
  return data;
}

world.beforeEvents.chatSend.subscribe((ev) => {
  const { message, sender } = ev;
  
  let [name, ...args] = Parser(message);
  if (!name.startsWith(Command.prefix) && !name.startsWith('#')) return;
  ev.cancel = true;
  
  let mainCommandName = name.split(' ')[0];
  let cmd = commands[mainCommandName];
  
  if (!cmd || !cmd?.validation(sender)) {
    return privateMessage(sender, `§cInvalid command: '${name.replace(Command.prefix, '')}'`);
  }

  if (cmd.reference) {
    cmd.callback(ev);
  } else {
    // Check for subcommands
    let subcommandName = args[0];
    
    if (subcommandName && cmd.subcommands && cmd.subcommands[subcommandName]) {
      cmd = cmd.subcommands[subcommandName];
      args = args.slice(1);
    } else if (cmd.subcommands && !subcommandName && cmd.callback) {
      return cmd.callback(sender, args);
    } else if (cmd.subcommands && !subcommandName) {
      let availableSubcommands = Object.keys(cmd.subcommands).join(', ');
      return privateMessage(sender, `§eAvailable subcommands: ${availableSubcommands}`);
    }

    // Parse Arguments
    let parsedArgs = {};
    cmd.args.forEach((argData, index) => {
      try {
        parsedArgs[argData.name] = checkArg(args[index], argData.type);
      } catch {}
    });
    
    let vals = Object.values(parsedArgs);
    if (vals.includes(null) || vals.length < args.length || vals.length > args.length) {
      return privateMessage(sender, '§cSyntax error');
    }

    // Execute callback
    cmd.callback(sender, parsedArgs);
  }
});

function privateMessage(sender, txt) {
  system.run(() => sender.runCommand(`tellraw @s { "rawtext": [ { "text": "${txt}" } ] }`));
}

// Export Command class
export default Command;