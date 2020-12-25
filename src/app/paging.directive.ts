import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appPaging]',
})
export class PagingDirective {
  constructor() {}
  @Input() id: string;
  @Input() maxSize: number;
  @Output() pageChange: EventEmitter<number>;
  @Output() pageBoundsCorrection: EventEmitter<number>;
}
