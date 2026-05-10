import { IEventBus, IIntegrationEvent, IEventHandler } from '../../application/events/EventContracts';

export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, IEventHandler<IIntegrationEvent>[]> = new Map();

  public subscribe<T extends IIntegrationEvent>(eventName: string, handler: IEventHandler<T>): void {
    const eventHandlers = this.handlers.get(eventName) || [];
  
    eventHandlers.push(handler as unknown as IEventHandler<IIntegrationEvent>);
    this.handlers.set(eventName, eventHandlers);
    
    console.log(`[EventBus] Підписано новий обробник на подію: ${eventName}`);
  }

  public publish<T extends IIntegrationEvent>(event: T): void {
    const eventHandlers = this.handlers.get(event.eventName) || [];
    
    if (eventHandlers.length === 0) {
      console.log(`[EventBus] Подія ${event.eventName} опублікована, але на неї немає підписників.`);
      return;
    }

    eventHandlers.forEach(handler => {
      setTimeout(() => {
        handler.handle(event).catch(error => {
          console.error(`[EventBus] Помилка під час обробки події ${event.eventName}:`, error);
        });
      }, 0);
    });
  }
}