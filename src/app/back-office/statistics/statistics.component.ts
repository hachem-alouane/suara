/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { ICardSatistics } from '../../core/models/card-statistics';
import { StatisticsService } from '../../data/services/statistics.service';
import { DatePickerComponent } from '../../shared/ui/date-picker/date-picker.component';
import { DropdownComponent } from '../../shared/ui/dropdown/dropdown.component';
import { DashboardBarComponent } from './dashboard-bar/dashboard-bar.component';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { DashboardPieComponent } from './dashboard-pie/dashboard-pie.component';
import { LocaleService } from '../../data/services/config/local.service';
import {
  ListOfEtatMessage,
  ListOfEtatMessageaaa,
  ListOfValueRegistryRequest,
} from '../../data/constants/list.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  GroupRadioValues,
  RadioButtonGroupComponent,
} from '../../shared/ui/radio-button-group/radio-button-group.component';

type Period =
  | 'semaine'
  | 'mois'
  | 'annee'
  | 'week'
  | 'month'
  | 'year'
  | 'custom';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    TranslateModule,
    ChartModule,
    DashboardBarComponent,
    DashboardCardComponent,
    ReactiveFormsModule,
    DatePickerComponent,
    DashboardPieComponent,
    DropdownComponent,
    RadioButtonGroupComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements OnInit {
  private readonly statisticsService = inject(StatisticsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly localeService = inject(LocaleService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  // =================== Courriers ===================
  formDatePickerCourrierBars = this.fb.group({});
  formRadioButtonsCourrierBars = this.fb.group({});

  labelsCourrierBars: string[] = [];
  datasetsCourrierBars: any[] = [];

  formDatePickerCourrierPie = this.fb.group({});

  labelsCourrierPie: string[] = [];
  datasetsCourrierPie: any[] = [];

  formStatsDemandeBars = this.fb.group({});
  labelesDemandeBars: string[] = [];
  datasetsDemandeBars: any[] = [];

  formStatsDemandePie = this.fb.group({});
  labelesDemandePie: string[] = [];
  datasetsDemandePie: any[] = [];

  filterEtatCourrier = [
    {
      id: 1,
      name: this.localeService.translate('EN_ATTENTE'),
      value: 'EN_ATTENTE',
    },
    { id: 2, name: this.localeService.translate('ACCEPTED'), value: 'ACCEPTE' },
    { id: 3, name: this.localeService.translate('REFUSED'), value: 'REFUSE' },
    { id: 4, name: this.localeService.translate('ARCHIVE'), value: 'ARCHIVE' },
  ];
  filterSensCourrier = [
    { id: 1, name: this.localeService.translate('ENTRANT'), value: 'ENTRANT' },
    {
      id: 2,
      name: this.localeService.translate('SORTANT'),
      value: 'SORTANT',
    },
  ];
  filterTypeDemande = [
    {
      id: 1,
      name: this.localeService.translate('RELATED_TO_COURIER'),
      value: 'ENTRANT',
    },
    {
      id: 2,
      name: this.localeService.translate('FROM_REGISTRY_OFFICE'),
      value: 'SORTANT',
    },
  ];

  // =================== Cards ===================
  dataDashboardCard: ICardSatistics[] = [
    {
      id: 1,
      number: 0,
      title: this.localeService.translate('MEMBERS'),
      icon: 'pi-graduation-cap',
    },
    {
      id: 2,
      number: 0,
      title: this.localeService.translate('GROUPS'),
      icon: 'pi-graduation-cap',
    },
    {
      id: 3,
      number: 0,
      title: this.localeService.translate('USERS'),
      icon: 'pi-user',
    },
  ];
  formFiltersPeriodCourrier: GroupRadioValues[] = [
    {
      label: this.localeService.translate('LAST_WEEK'),
      value: 'semaine',
      size: 'small',
      styleClassLabel: ' font-semibold',
      styleClass: 'flex align-items-center',
    },
    {
      label: this.localeService.translate('LAST_MONTH'),
      value: 'mois',
      size: 'small',
      styleClassLabel: ' font-semibold',
      styleClass: 'flex align-items-center',
    },
    {
      label: this.localeService.translate('LAST_YEAR'),
      value: 'annee',
      size: 'small',
      styleClassLabel: ' font-semibold',
      styleClass: 'flex align-items-center',
    },
  ];

  formFiltersdemande: GroupRadioValues[] = [
    {
      label: this.localeService.translate('LAST_WEEK'),
      value: 'week',
      size: 'small',
      styleClassLabel: ' font-semibold',
    },
    {
      label: this.localeService.translate('LAST_MONTH'),
      value: 'month',
      size: 'small',
      styleClassLabel: ' font-semibold',
    },
    {
      label: this.localeService.translate('LAST_YEAR'),
      value: 'year',
      size: 'small',
      styleClassLabel: ' font-semibold',
    },
  ];
  ngOnInit(): void {
    this.totalMembers();
    this.totalGroups();
    this.totalUsers();
    this.loadDefaultcourrierBars();
    this.loadDefaultcourrierPie();
    this.loadDefaultDemandeBars();
    this.loadDefaultDemandePie();
    this.listenToFormDatePickerCourrierBars();
    this.listenToformRadioButtonsCourrierBars();
    this.listenToformRadioButtonsCourrierPie();
    this.listenToformDemandeBars();
    this.listenToformDemandePie();
  }
  private loadDefaultcourrierBars() {
    this.statisticsService.getStatCourrierSemaine().subscribe((res) => {
      this.setDataPusLabels(res);
    });
  }
  private loadDefaultcourrierPie() {
    this.statisticsService
      .getStatCourrierPriorite('semaine')
      .subscribe((res) => {
        this.setDataPusLabelsPieCourrier(res);
      });
  }
  private loadDefaultDemandeBars() {
    this.statisticsService.getStatutDemandeCount('week').subscribe((res) => {
      this.setDataPusLabelsBarsDemande(res);
    });
  }
  private loadDefaultDemandePie() {
    this.statisticsService
      .getStatDemandePriorite('semaine')
      .subscribe((res) => {
        console.log(
          '🚀 ~ StatisticsComponent ~ loadDefaultDemandePieloadDefaultDemandePie ~ res:',
          res
        );
        this.setDataPusLabelsPieDemande(res);
      });
  }
  private setDataPusLabelsPieDemande(res: any) {
    this.labelesDemandePie = res.map((x: any) =>
      this.localeService.translate(
        ListOfValueRegistryRequest[x?.priorite] ??
          ListOfValueRegistryRequest['NORMAL']
      )
    );
    this.datasetsDemandePie = [
      {
        label: this.localeService.translate('ORDERS'),
        data: res.map((x: any) => x?.nombredemande),
      },
    ];
    this.cdr.markForCheck();
  }
  private setDataPusLabelsBarsDemande(res: any) {
    this.labelesDemandeBars = res.map((x: any) =>
      this.localeService.translate(
        ListOfEtatMessageaaa[x?.statut] ?? ListOfEtatMessageaaa['Default']
      )
    );
    this.datasetsDemandeBars = [
      {
        label: this.localeService.translate('ORDERS'),
        data: res.map((x: any) => x.count),
      },
    ];
    this.cdr.markForCheck();
  }
  private setDataPusLabelsPieCourrier(res: any) {
    this.labelsCourrierPie = res.map(
      (x: any) =>
        this.localeService.translate(ListOfValueRegistryRequest[x?.priorite]) ??
        'NORMAL'
    );

    this.datasetsCourrierPie = [
      {
        label: this.localeService.translate('MESSAGES'),
        data: res.map((x: any) => x.nombreCourrier),
      },
    ];
    this.cdr.markForCheck();
  }
  private listenToFormDatePickerCourrierBars() {
    this.formDatePickerCourrierBars.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        console.log(
          '🚀 ~ StatisticsComponent ~ listenToFormDatePickerCourrierBars ~ res:',
          res
        );
        if (res?.startDate && res?.endDate)
          this.statisticsService
            .getStatCourrierPeriode(res?.startDate, res?.endDate)
            .subscribe((data) => {
              this.setDataPusLabels(data);
            });
      });
  }
  private listenToformDemandePie() {
    this.formStatsDemandePie.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        console.log(
          '🚀 ~ StatisticsComponent ~ listenToformDemandeBars ~ res:',
          res
        );

        this.statisticsService
          .getStatDemandePriorite(
            res?.period,
            res?.startDate,
            res?.endDate,
            res?.typeDemande
          )
          .subscribe((data) => {
            this.setDataPusLabelsPieDemande(data);
          });
      });
  }
  private listenToformDemandeBars() {
    this.formStatsDemandeBars.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        console.log(
          '🚀 ~ StatisticsComponent ~ listenToformDemandeBars ~ res:',
          res
        );

        this.statisticsService
          .getStatutDemandeCount(
            res?.startDate || res?.endDate ? 'custom' : res?.period,
            res?.typeDemande,
            res?.startDate,
            res?.endDate
          )
          .subscribe((data) => {
            this.setDataPusLabelsBarsDemande(data);
          });
      });
  }
  private listenToformRadioButtonsCourrierBars() {
    this.formRadioButtonsCourrierBars.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        console.log(
          '🚀 ~ StatisticsComponent ~ listenToformRadioButtonsCourrierBars ~ res:',
          res
        );
        switch (res?.filtersPeriod) {
          case 'semaine':
            this.statisticsService
              .getStatCourrierSemaine()
              .subscribe((data) => {
                this.setDataPusLabels(data);
              });

            break;
          case 'mois':
            this.statisticsService.getStatCourrierMois().subscribe((data) => {
              this.setDataPusLabels(data);
            });

            break;

          case 'annee':
            this.statisticsService.getStatCourrierAnnee().subscribe((data) => {
              this.setDataPusLabels(data);
            });

            break;

          default:
            this.statisticsService
              .getStatCourrierSemaine()
              .subscribe((data) => {
                this.setDataPusLabels(data);
              });

            break;
        }
      });
  }
  private listenToformRadioButtonsCourrierPie() {
    this.formDatePickerCourrierPie.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        console.log(
          '🚀 ~ StatisticsComponent ~ listenToformRadioButtonsCourrierPie ~ res:',
          res
        );
        this.statisticsService
          .getStatCourrierPriorite(
            res?.filtersPeriod,
            res?.startDate,
            res?.endDate,
            res?.etatCourrier,
            res?.sensCourrier
          )
          .subscribe((data) => {
            this.setDataPusLabelsPieCourrier(data);
          });
      });
  }
  private setDataPusLabels(res: any) {
    this.labelsCourrierBars = res.map((x: any) =>
      this.localeService.translate(
        ListOfEtatMessage[x?.etatCourrier] ?? 'Default'
      )
    );
    const values = res?.map(
      (x: any) => x.nombreCourrier ?? x.nombre ?? x.total
    );
    this.datasetsCourrierBars = [
      {
        label: this.localeService.translate('MESSAGES'),
        data: values,
        backgroundColor: ['rgba(59,130,246,0.5)'],
        borderWidth: 1,
      },
    ];
    this.cdr.markForCheck();
  }
  totalMembers() {
    this.statisticsService.getTotalMembers().subscribe((total) => {
      this.updateCard(1, total);
      this.cdr.markForCheck();
    });
  }
  totalGroups() {
    this.statisticsService.getTotalGroups().subscribe((total) => {
      this.updateCard(2, total);
      this.cdr.markForCheck();
    });
  }
  totalUsers() {
    this.statisticsService.getTotalUsers().subscribe((total) => {
      console.log('🚀 ~ StatisticsComponent ~ totalUsers ~ total:', total);
      this.updateCard(3, total);
      this.cdr.markForCheck();
    });
  }

  private updateCard(id: number, value: number) {
    this.dataDashboardCard = this.dataDashboardCard.map((card) =>
      card.id === id ? { ...card, number: value } : card
    );
    this.cdr.markForCheck();
  }
}
