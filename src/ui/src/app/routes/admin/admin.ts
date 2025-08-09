import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminCollections } from '../../components/admin-collections/admin-collections';
import { AdminSettings } from '../../components/admin-settings/admin-settings';

@Component({
  selector: 'app-admin',
  imports: [TranslateModule, MatTabsModule, AdminCollections, AdminSettings],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {

}
