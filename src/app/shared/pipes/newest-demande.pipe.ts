// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({ name: 'NewestDemande', standalone: true })
// export class NewestDemandePipe implements PipeTransform {
//   transform(changes: IModification[]): any {
//     const fields = [
//       'objet',
//       'description',
//       'creeParEmail',
//       'destinataireEmail',
//       'dateDerniereModification',
//     ];
//     const result: any = {};

//     for (const field of fields) {
//       const entry = changes.find((c) => c.champ === field);
//       if (entry) {
//         const key =
//           field === 'objet'
//             ? 'object'
//             : field === 'dateDerniereModification'
//             ? 'date'
//             : field;
//         result[key] = entry.nouvelleValeur;
//       }
//     }

//     return result;
//   }
// }
