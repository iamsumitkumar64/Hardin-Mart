export abstract class PolicyClass {
    protected policyMap = new Map<string, any>();
    protected readonly SHIPPING_EXCHANGE = 'shipping.exchange';
    protected readonly BILLING_EXCHANGE = 'billing.exchange';
    protected readonly USER_EXCHANGE = 'user.exchange';
    protected readonly SALE_EXCHANGE = 'sale.exchange';

    abstract handleSetPolicy(key: string, policy: any): void;

    abstract handleGetPolicy(key: string): void;

    abstract handleRemovePolicy(key: string): void;

    abstract handleProcess(key: string): void;
}