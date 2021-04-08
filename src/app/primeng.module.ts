import { NgModule } from '@angular/core';

import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { TabViewModule } from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {SelectButtonModule} from 'primeng/selectbutton';
import {MultiSelectModule} from 'primeng/multiselect';
import {PanelModule} from 'primeng/panel';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  exports: [
    ListboxModule,
    MenuModule,
    MenubarModule,
    ToolbarModule,
    ButtonModule,
    FieldsetModule,
    PasswordModule,
    InputTextModule,
    InputMaskModule,
    TabViewModule,
    TableModule,
    DialogModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    BreadcrumbModule,
    CalendarModule,
    DropdownModule,
    SelectButtonModule,
    MultiSelectModule,
    PanelModule,
    InputTextareaModule  
   
  ]
})
export class PrimeNgModule { }