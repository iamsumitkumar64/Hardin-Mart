export abstract class PolicyClass {
    abstract handleSetPolicy(key: string, policy: any): void;

    abstract handleGetPolicy(key: string): void;

    abstract handleRemovePolicy(key: string): void;

    abstract handleProcess(key: string): void;
}