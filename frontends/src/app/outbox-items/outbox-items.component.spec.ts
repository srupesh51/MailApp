import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboxItemsComponent } from './outbox-items.component';

describe('OutboxItemsComponent', () => {
  let component: OutboxItemsComponent;
  let fixture: ComponentFixture<OutboxItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboxItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboxItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
