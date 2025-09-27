/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IModules, IPermission } from '../../../core/models/member.interface';
import { PermissionService } from '../../../data/services/permission.service';
import { PicklistComponent } from '../../../shared/ui/picklist/picklist.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocaleService } from '../../../data/services/config/local.service';
import {
  ListOfModules,
  ListOfPermissions,
} from '../../../data/constants/list.constants';
import { ModuleTagPipe } from '../../../shared/pipes/module-tag.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  standalone: true,
  imports: [
    PicklistComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TagModule,
    CommonModule,
    ButtonComponent,
    TranslateModule,
    ModuleTagPipe,
  ],
  providers: [DialogService, DialogUtilsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly permissionService = inject(PermissionService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  userId = this.dynamicDialogConfig?.data?.id;
  roleUserId = this.dynamicDialogConfig?.data?.role;
  // modules$ = this.permissionService.getModulesPermissions();
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly localeService = inject(LocaleService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  myForm = this.fb.group({});

  permissions: IPermission[] = [];
  allPermissions: any[] = [];
  allPermissionsTarget: any[] = [];
  source: any[] = [];
  target: any[] = [];
  ListOfModules = ListOfModules;

  modules: IModules[] = [];
  modulesTarget: IModules[] = [];
  loading = false;

  // [
  //   {
  //     id: 3,
  //     name: 'USER',
  //     permissions: [
  //       {
  //         id: 10,
  //         name: 'BLOCK',
  //       },
  //       {
  //         id: 8,
  //         name: 'SELECT',
  //       },
  //       {
  //         id: 7,
  //         name: 'UPDATE',
  //       },
  //       {
  //         id: 11,
  //         name: 'UNBLOCK',
  //       },
  //       {
  //         id: 6,
  //         name: 'CREATE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     name: 'ORGANIZATION',
  //     permissions: [
  //       {
  //         id: 13,
  //         name: 'ENABLE',
  //       },
  //       {
  //         id: 12,
  //         name: 'DISABLE',
  //       },
  //       {
  //         id: 8,
  //         name: 'SELECT',
  //       },
  //       {
  //         id: 7,
  //         name: 'UPDATE',
  //       },
  //       {
  //         id: 6,
  //         name: 'CREATE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     name: 'SUB_ORGANIZATION',
  //     permissions: [
  //       {
  //         id: 13,
  //         name: 'ENABLE',
  //       },
  //       {
  //         id: 12,
  //         name: 'DISABLE',
  //       },
  //       {
  //         id: 8,
  //         name: 'SELECT',
  //       },
  //       {
  //         id: 7,
  //         name: 'UPDATE',
  //       },
  //       {
  //         id: 6,
  //         name: 'CREATE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 6,
  //     name: 'COUNTRY',
  //     permissions: [
  //       {
  //         id: 13,
  //         name: 'ENABLE',
  //       },
  //       {
  //         id: 12,
  //         name: 'DISABLE',
  //       },
  //       {
  //         id: 8,
  //         name: 'SELECT',
  //       },
  //       {
  //         id: 7,
  //         name: 'UPDATE',
  //       },
  //       {
  //         id: 6,
  //         name: 'CREATE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 7,
  //     name: 'MEMBER',
  //     permissions: [
  //       {
  //         id: 13,
  //         name: 'ENABLE',
  //       },
  //       {
  //         id: 12,
  //         name: 'DISABLE',
  //       },
  //       {
  //         id: 8,
  //         name: 'SELECT',
  //       },
  //       {
  //         id: 7,
  //         name: 'UPDATE',
  //       },
  //       {
  //         id: 6,
  //         name: 'CREATE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 8,
  //     name: 'GROUP',
  //     permissions: [
  //       {
  //         id: 13,
  //         name: 'ENABLE',
  //       },
  //       {
  //         id: 12,
  //         name: 'DISABLE',
  //       },
  //       {
  //         id: 8,
  //         name: 'SELECT',
  //       },
  //       {
  //         id: 7,
  //         name: 'UPDATE',
  //       },
  //       {
  //         id: 6,
  //         name: 'CREATE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 9,
  //     name: 'MODEL',
  //     permissions: [
  //       {
  //         id: 13,
  //         name: 'ENABLE',
  //       },
  //       {
  //         id: 12,
  //         name: 'DISABLE',
  //       },
  //       {
  //         id: 9,
  //         name: 'DELETE',
  //       },
  //       {
  //         id: 8,
  //         name: 'SELECT',
  //       },
  //       {
  //         id: 7,
  //         name: 'UPDATE',
  //       },
  //       {
  //         id: 6,
  //         name: 'CREATE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 10,
  //     name: 'TRASH',
  //     permissions: [
  //       {
  //         id: 19,
  //         name: 'RESTORE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 11,
  //     name: 'WRITE_MESSAGE',
  //     permissions: [
  //       {
  //         id: 8,
  //         name: 'SELECT',
  //       },
  //       {
  //         id: 6,
  //         name: 'CREATE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 12,
  //     name: 'REGISTRY_OFFICE_REQUESTS',
  //     permissions: [
  //       {
  //         id: 14,
  //         name: 'VIEW',
  //       },
  //       {
  //         id: 17,
  //         name: 'DECISION',
  //       },
  //     ],
  //   },
  //   {
  //     id: 13,
  //     name: 'INCOMING_CORRESPONDENCE',
  //     permissions: [
  //       {
  //         id: 9,
  //         name: 'DELETE',
  //       },
  //       {
  //         id: 14,
  //         name: 'VIEW',
  //       },
  //       {
  //         id: 18,
  //         name: 'ARCHIVE',
  //       },
  //     ],
  //   },
  //   {
  //     id: 14,
  //     name: 'OUTGOING_CORRESPONDENCE',
  //     permissions: [
  //       {
  //         id: 14,
  //         name: 'VIEW',
  //       },
  //     ],
  //   },
  //   {
  //     id: 15,
  //     name: 'CORRESPONDENCE_FOLLOW_UP',
  //     permissions: [
  //       {
  //         id: 14,
  //         name: 'VIEW',
  //       },
  //     ],
  //   },
  //   {
  //     id: 16,
  //     name: 'ARCHIVED_CORRESPONDENCE',
  //     permissions: [
  //       {
  //         id: 15,
  //         name: 'DISTRIBUTE',
  //       },
  //       {
  //         id: 14,
  //         name: 'VIEW',
  //       },
  //     ],
  //   },
  //   {
  //     id: 17,
  //     name: 'DISTRIBUTED_CORRESPONDENCE',
  //     permissions: [
  //       {
  //         id: 14,
  //         name: 'VIEW',
  //       },
  //     ],
  //   },
  //   {
  //     id: 18,
  //     name: 'ACCEPTED_MAIL_LIST',
  //     permissions: [
  //       {
  //         id: 16,
  //         name: 'SEND',
  //       },
  //       {
  //         id: 14,
  //         name: 'VIEW',
  //       },
  //     ],
  //   },
  //   {
  //     id: 19,
  //     name: 'STATISTICS',
  //     permissions: [
  //       {
  //         id: 14,
  //         name: 'VIEW',
  //       },
  //     ],
  //   },
  // ];

  ngOnInit(): void {
    this.getModulesByUserId();
  }
  ngAfterViewInit(): void {
    this.listenToSourceFilterChanges();
  }
  private getModulesByUserId() {
    this.permissionService
      .getModulesByUserId(this.userId)
      .subscribe((targetModules) => {
        this.modulesTarget = targetModules;
        this.allPermissionsTarget = this.modulesTarget.flatMap((module) =>
          module.permissions.map((perm) => ({
            moduleId: module.id,
            moduleName: this.localeService.translate(
              ListOfModules[module.name] || ListOfModules['Default']
            ),
            moduleNameRef: module.name,
            permId: perm.id,
            permName: this.localeService.translate(
              ListOfPermissions[perm.name] || ListOfPermissions['Default']
            ),
            permNameRef: perm.name,
          }))
        );
        this.target = [...this.allPermissionsTarget];
        this.getModules(this.target);
      });
  }

  private listenToSourceFilterChanges() {
    this.myForm
      .get('filterSource')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filterValue: string) => {
        let filtered = [...this.allPermissions];

        if (this.target.length) {
          const targetIds = this.target.map((t) => t.permId + '-' + t.moduleId);
          filtered = filtered.filter(
            (item) => !targetIds.includes(item.permId + '-' + item.moduleId)
          );
        }

        if (filterValue && filterValue.trim() !== '') {
          const lower = filterValue.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.permName.toLowerCase().includes(lower) ||
              item.moduleName.toLowerCase().includes(lower)
          );
        }

        this.source = filtered;
        this.cdr.markForCheck();
      });
  }
  private getModules(target: any[]) {
    this.permissionService
      .getModulesPermissionsByRole(this.roleUserId)
      .subscribe((modules) => {
        this.modules = modules;
        this.allPermissions = this.modules.flatMap((module) =>
          module.permissions.map((perm) => ({
            moduleId: module.id,
            moduleName: this.localeService.translate(
              ListOfModules[module.name] || ListOfModules['Default']
            ),
            moduleNameRef: module.name,
            permId: perm.id,
            permName: this.localeService.translate(
              ListOfPermissions[perm.name] || ListOfPermissions['Default']
            ),
            permNameRef: perm.name,
          }))
        );
        this.source = [
          ...this.allPermissions.filter(
            (item) =>
              !target.some(
                (t) => t.permId === item.permId && t.moduleId === item.moduleId
              )
          ),
        ];
        this.cdr.markForCheck();
      });
  }
  get groupedTarget() {
    const map = new Map<string, string[]>();
    this.target.forEach((item: any) => {
      if (!map.has(item.moduleNameRef)) {
        map.set(item.moduleNameRef, []);
      }
      map.get(item.moduleNameRef)!.push(item.permName);
    });
    return Array.from(map.entries()).map(([moduleNameRef, perms]) => ({
      moduleNameRef,
      perms,
    }));
  }
  savePermission() {
    if (!this.target?.length) {
      this.dialogUtilsService.showErrorMessage('ADD_AT_LEAST_ONE_PERMISSION');
      return;
    }
    this.loading = true;
    const map = new Map<string, string[]>();
    this.target.forEach((item: any) => {
      if (!map.has(item.moduleId)) {
        map.set(item.moduleId, []);
      }
      map.get(item.moduleId)!.push(item.permId);
    });
    const ok = Array.from(map.entries()).map(([moduleId, perms]) => ({
      moduleId,
      permissionIds: perms,
    }));
    this.permissionService
      .assignPermissions(this.userId, ok)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (_) => {
          this.ref.close(true);
        },
        error: (_) => {
          this.dialogUtilsService.showErrorMessage();
        },
      });
  }
  getTagClass(module: string): string {
    switch (module) {
      case 'USER':
        return 'bg-blue-500';
      case 'ORGANIZATION':
        return 'bg-green-700';
      case 'SUB_ORGANIZATION':
        return 'bg-purple-500';
      case 'COUNTRY':
        return 'bg-orange-500';
      case 'MEMBER':
        return 'bg-indigo-500';
      case 'GROUP':
        return 'bg-teal-500';
      case 'MODEL':
        return 'bg-pink-500';
      case 'TRASH':
        return 'bg-red-500';
      case 'WRITE_MESSAGE':
        return 'bg-cyan-500';
      case 'REGISTRY_OFFICE_REQUESTS':
        return 'bg-indigo-500';
      case 'INCOMING_CORRESPONDENCE':
        return 'bg-green-400';
      case 'OUTGOING_CORRESPONDENCE':
        return 'bg-yellow-500';
      case 'CORRESPONDENCE_FOLLOW_UP':
        return 'bg-blue-500';
      case 'ARCHIVED_CORRESPONDENCE':
        return 'bg-red-400';
      case 'DISTRIBUTED_CORRESPONDENCE':
        return 'bg-cyan-500';
      case 'ACCEPTED_MAIL_LIST':
        return 'bg-pink-500';
      case 'STATISTICS':
        return 'bg-gray-500';
      default:
        return 'bg-gray-900';
    }
  }

  cancel() {
    this.ref.close();
  }
  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
