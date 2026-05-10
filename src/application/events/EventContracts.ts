export interface IIntegrationEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export interface IEventHandler<T extends IIntegrationEvent> {
  handle(event: T): Promise<void>;
}

export interface IEventBus {
  publish<T extends IIntegrationEvent>(event: T): void;
  subscribe<T extends IIntegrationEvent>(eventName: string, handler: IEventHandler<T>): void;
}