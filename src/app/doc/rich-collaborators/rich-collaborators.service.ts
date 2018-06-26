import { Injectable } from '@angular/core'
import { ICollaborator } from 'mute-core'
import { merge, Observable, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

import { EProperties } from '../../core/settings/EProperties'
import { Profile } from '../../core/settings/Profile'
import { SettingsService } from '../../core/settings/settings.service'
import { NetworkService } from '../network'
import { Colors } from './Colors'
import { RichCollaborator } from './RichCollaborator'

@Injectable()
export class RichCollaboratorsService {
  private joinSubject: Subject<RichCollaborator>
  private leaveSubject: Subject<number>
  private updateSubject: Subject<RichCollaborator>
  private me: Promise<void>
  private colors: Colors

  public collaborators: RichCollaborator[]

  constructor(settings: SettingsService, network: NetworkService) {
    this.joinSubject = new Subject()
    this.leaveSubject = new Subject()
    this.updateSubject = new Subject()
    this.colors = new Colors()

    let me = this.createMe(settings.profile)
    this.collaborators = [me]
    this.me = Promise.resolve()
    settings.onChange
      .pipe(filter((props) => props.includes(EProperties.profile) || props.includes(EProperties.profileDisplayName)))
      .subscribe((props) => {
        const index = this.collaborators.indexOf(me)
        if (props.includes(EProperties.profile)) {
          me = this.createMe(settings.profile)
        } else {
          me.displayName = settings.profile.displayName
        }
        this.collaborators[index] = me
        this.updateSubject.next(me)
      })
  }

  get onUpdate(): Observable<RichCollaborator> {
    return this.updateSubject.asObservable()
  }

  get onJoin(): Observable<RichCollaborator> {
    return this.joinSubject.asObservable()
  }

  get onLeave(): Observable<number> {
    return this.leaveSubject.asObservable()
  }

  get onChanges(): Observable<void> {
    return merge(this.updateSubject, this.joinSubject, this.leaveSubject, this.me).pipe(map(() => undefined))
  }

  subscribeToUpdateSource(source: Observable<ICollaborator>) {
    source.subscribe((collab: ICollaborator) => {
      for (const c of this.collaborators) {
        if (collab.id === c.id) {
          c.update(collab)
          this.updateSubject.next(c)
          break
        }
      }
    })
  }

  subscribeToJoinSource(source: Observable<ICollaborator>) {
    source.subscribe((collab) => {
      const rc = new RichCollaborator(collab, this.colors.pick())
      this.collaborators[this.collaborators.length] = rc
      this.joinSubject.next(rc)
    })
  }

  subscribeToLeaveSource(source: Observable<number>) {
    source.subscribe((id: number) => {
      const index = this.collaborators.findIndex((c) => c.id === id)
      this.colors.dismiss(this.collaborators[index].color)
      this.collaborators.splice(index, 1)
      this.leaveSubject.next(id)
    })
  }

  private createMe(profile: Profile): RichCollaborator {
    return new RichCollaborator(
      {
        id: -1,
        login: profile.login,
        displayName: profile.displayName,
        email: profile.email,
        avatar: profile.avatar,
      },
      this.colors.pick()
    )
  }
}
