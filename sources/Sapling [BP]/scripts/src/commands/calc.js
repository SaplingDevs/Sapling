import { Command } from "@script-api/core.js";
import { world } from "@script-api/server.js";
import { Utils } from "@script-api/sapling.js";

new Command()
	.setName('calc')
	.addArgument('string', 'expression')
	.setCallback(CalcCommand)
	.build();
	
function CalcCommand(sender, { expression }) {
	const regex = /^[0-9+\-\/a-z!%><=*^&?:\{\}();.\s]+$/
	const test = regex.test(expression);
	
	if (!test) return world.sendMessage('§cInvalid Expression');
	
	let parsed_ex = expression;
	for (let x of expression) {
		parsed_ex = parsed_ex
			.replace('^', '**')
			.replace('{', '"')
			.replace('}', '"');
	}
	
	try {
		const res = Function(`return (${parsed_ex})`)().toString();

		Utils.privateMessage(sender, `§q> §r${expression}\n  §u[r]: §h${res}`)
	} catch (e) { world.sendMessage(`§cError with expression evaluation`) }
}