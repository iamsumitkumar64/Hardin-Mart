export interface PolicyInterfaceService {
    handleSetPolicy(key: string, policy: any): Promise<void>;

    handleGetPolicy(key: string): Promise<any>;

    handleRemovePolicy(key: string): void;

    handleProcess(key: string): Promise<any>;
}