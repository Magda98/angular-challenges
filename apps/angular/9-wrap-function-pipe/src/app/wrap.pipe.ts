import { Pipe } from '@angular/core';

@Pipe({
  name: 'wrap',
  standalone: true,
})
export class WrapPipe {
  transform<T extends (...args: any[]) => any>(fn: T, ...args: any[]): T {
    return fn.apply(this, args);
  }
}
