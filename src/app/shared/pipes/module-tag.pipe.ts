import { Pipe, PipeTransform } from '@angular/core';
import { ListOfModulesTags } from '../../data/constants/list.constants';

@Pipe({
  name: 'moduleTag',
  standalone: true,
})
export class ModuleTagPipe implements PipeTransform {
  transform(module: string): string {
    return ListOfModulesTags[module] ?? ListOfModulesTags['Default'];
  }
}
