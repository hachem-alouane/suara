import { ExtrasColumn } from './extras_column.enum';
import { TableType } from './table-type.enum';

export interface ICols {
  id?: number;
  field?: string;
  header?: string;
  relation?: string;
  relation2?: string;
  relation3?: string;
  fieldTo?: string;
  fieldFrom?: string;
  isVisible?: boolean;
  isDraggable?: boolean;
  type?: TableType;
  extras?: ExtrasColumn;
  order?: number;
  idPivot?: number;
  appendTo?: string;
  dependsTo?: string;
  disableSort?: boolean;
  tooltip?: string;
  valueFixed?: string;
  ltr?: boolean;
}
