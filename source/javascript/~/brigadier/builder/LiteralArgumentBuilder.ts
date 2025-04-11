import { ArgumentBuilder, LiteralCommandNode } from "../../brigadier";

export class LiteralArgumentBuilder<S> extends ArgumentBuilder<S, LiteralArgumentBuilder<S>> {
    private literal: string;

    constructor(literal: string) {
        super();
        this.literal = literal
    }

    getThis(): LiteralArgumentBuilder<S> {
        return this;
    }

    getLiteral(): string {
        return this.literal;
    }
    
    build(): LiteralCommandNode<S> {
        const result = new LiteralCommandNode<S>(this.getLiteral(), this.getCommand(), this.getRequirement(), this.getRedirect(), this.getRedirectModifier(), this.isFork());
        for (const argument of this.getArguments()) {
            result.addChild(argument);
        }
        return result;
    }
}

export function literal<S = any>(name: string): LiteralArgumentBuilder<S> {
    return new LiteralArgumentBuilder(name);
}
