import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { DocsComponent } from './docs/docs.component'
import { DocComponent } from './doc/doc.component'
import { DocResolverService } from './doc/doc-resolver.service'
import { DocsResolverService } from './docs/docs-resolver.service'

const routes: Routes = [
  {
    path: '',
    component: DocsComponent,
    resolve: { file: DocsResolverService }
  }, {
    path: 'home',
    redirectTo: '',
    children: [
      {
        path: ':path',
        component: DocsComponent,
        resolve: { file: DocsResolverService }
      }
    ]
  }, {
    path: 'trash',
    component: DocsComponent,
    resolve: { file: DocsResolverService },
    children: [
      {
        path: '**',
        component: DocsComponent
      }
    ]
  }, {
    path: 'history', redirectTo: ''
  }, {
    path: 'history/:key',
    component: DocComponent,
    resolve: { file: DocResolverService }
  }, {
    path: ':key',
    component: DocComponent,
    resolve: { file: DocResolverService }
  }, {
    path: '**', redirectTo: ''
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [ DocsResolverService, DocResolverService ]
})
export class AppRoutingModule {}
