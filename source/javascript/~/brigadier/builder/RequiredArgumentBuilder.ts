import { 
    ArgumentBuilder,
    ArgumentType,
    ArgumentCommandNode
} from "../../brigadier";

export class RequiredArgumentBuilder<S, T> extends ArgumentBuilder<S, RequiredArgumentBuilder<S, T>> {
    private name: string;
    private type: ArgumentType<T>;

    constructor(name: string, type: ArgumentType<T>) {
        super();
        this.name = name;
        this.type = type;
    }

    getThis(): RequiredArgumentBuilder<S, T> {
        return this;
    }

    getName(): string {
        return this.name;
    }

    getType(): ArgumentType<T> {
        return this.type;
    }
    
    build(): ArgumentCommandNode<S, T> {
        const result = new ArgumentCommandNode(this.getName(), this.getType(), this.getCommand(), this.getRequirement(), this.getRedirect(), this.getRedirectModifier(), this.isFork());
        for (const argument of this.getArguments()) {
            result.addChild(argument);
        }
        return result;
    }
}

export function argument<S = any, T = any>(name: string, type: ArgumentType<T>): RequiredArgumentBuilder<S, T> {
    return new RequiredArgumentBuilder(name, type);
}
